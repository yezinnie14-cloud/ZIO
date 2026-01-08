import supabase from './supabaseClient.js';

// 메인 페이지 
// 주차장 목록 , 키워드 목록 
export const getMainInfo = async () => {
  // 주차장 테이블 정보 가져오기 
  const {data, error} = await supabase
    .from("parking_lots")
    .select(
      ' id, parking_name, address, lat, lon, price_per_1h, photo_urls, keywords(keyword)'
    )
    .order("price_per_1h", { ascending:true})

    if(error){
      throw new Error("주차장 조회 실패:" + error.message);
    }

    const lots = (data || []).map((lot) => ({
      ...lot,keywords: (lot.keywords || []).map((i) => i.keyword),
    }));

    return lots;
};

// 상세 페이지 
// 선택한 주차장 조회
export const getDetailInfo = async (lotId) => {
  const {data, error} = await supabase
    .from("parking_lots")
    .select(
      "id, parking_name,address, lat, lon, price_per_1h, total_space, photo_urls"
    )
    .eq("id", lotId)
    .single();

  if(error){
    throw new Error("주차장 상세 조회 실패" + error.message);
  }

  return data;
}

// 선택한 주차장의 주차면 목록 
export const getParkingSpace = async (lotId) => {
  const {data, error} = await supabase
    .from("parking_spaces")
    .select(
      "id, lot_id, space_code, space_type, is_active"
    )
    .eq("lot_id", lotId)
    .order("space_code", {ascending:true});

  if(error){
    throw new Error("주차면 조회 실패" + error.message);
  }

  return data || [];
}

// 점유 주차 자리 
export const getParked = async (lotId) => {
  const nowISO = new Date().toISOString();

  const {data, error} = await supabase
    .from("reservation")
    .select("space_id, status")
    .eq("lot_id", lotId)
    .in("status", ["RESERVED", "USING"])
    .lte("start_at",nowISO)
    .gt("end_at",nowISO);

  if(error){
    throw new Error("점유 자리 조회 실패: " + error.message);
  }

  return data || [];
};

// 결제 페이지 
// 주차장 정보 조회용 api 
export const getPaymentInfo = async (lotId) => {
  const {data, error} = await supabase
    .from("parking_lots")
    .select("id, parking_name, address, photo_urls, price_per_1h")
    .eq("id", lotId)
    .single();

  if(error){
    throw new Error("결제페이지 주차장 정보 조회 실패:" + error.message);
  }

  return data;
}

// 결제(예약) api 
export const createReservation = async (payload) => {

  const {lotId, spaceId, startAt, endAt, payType, payMethod, amount, userId, guestPhone, guestCarNum}
  = payload;

  // 최소 검증 로직 
  if (!lotId) throw new Error("lotId 없음");
  if (!spaceId) throw new Error("spaceId 없음");
  if (!startAt || !endAt) throw new Error("start_at/end_at 없음");
  if (!payType) throw new Error("pay_type 없음 (시간권/정기권)");
  if (!payMethod) throw new Error("pay_method 없음");

  // 총 금액은 숫자로 변환
  const amountInt = Number(amount);
  if (!Number.isFinite(amountInt)) throw new Error("amount가 숫자가 아님");

  // 회원 비회원 구분 
  const isMember = Boolean(userId);
  const isGuest = Boolean(guestPhone && guestCarNum);

  if (!isMember && !isGuest) {
    throw new Error("사용자 정보가 필요함");
  }
  if (isMember && isGuest) {
    throw new Error("회원, 비회원 둘 중 하나만 들어와주세요");
  }

  //입차, 출차 문자열로 변환 
  const startISO = startAt instanceof Date ? startAt.toISOString() : startAt;
  const endISO = endAt instanceof Date ? endAt.toISOString() : endAt;

  // 입차 출차 에러 방지 로직 
  if(new Date(startISO) >= new Date(endISO)){
    throw new Error("입차시간이 출차시간보다 빨라야함.");
  }

  //reservation에 들어갈 정보 로직 
  const input = {
    lot_id : lotId,
    space_id: spaceId,
    start_at: startISO,
    end_at: endISO,
    pay_type: payType,       // 시간권, 정기권
    pay_method: payMethod,   // 결제수단 : 문자열 처리 
    amount: amountInt,          // 총 금액 코드로 계산 후 amount에 저장
  };

  if (isMember) input.user_id = userId;
  if (isGuest) {
    input.guest_phone = guestPhone;
    input.guest_car_num = guestCarNum;
  }

  // 중복 예약 체크 
  const {data:dup, error:dupErr} = await supabase
    .from("reservation")
    .select("id")
    .eq("lot_id", lotId)
    .eq("space_id", spaceId)
    .in("status", ["RESERVED", "USING"])
    .lt("start_at", endISO)
    .gt("end_at", startISO)
    .limit(1);

  if (dupErr) throw new Error("중복 예약 체크 실패: " + dupErr.message);
  if (dup && dup.length > 0) throw new Error("이미 예약된 자리임");

  // 진짜 예약. 
  const { data, error } = await supabase
    .from("reservation")
    .insert(input)
    // 결제완료 팝업/예약현황 이동에 바로 쓸 수 있게 결과 리턴 
    .select(
      `id, lot_id, space_id, user_id, guest_phone, guest_car_num, start_at, end_at, 
      pay_type, pay_method, amount, status, is_active, created_at`
    )
    .single();

  if (error) throw new Error("예약 실패: " + error.message);

  return data;
}

//이용내역 페이지 
// 비회원-> 전번 입력 시 조회가능
export const guestReservationInfo = async ({phone}) => {
  if(!phone) throw new Error("비회원 정보 없음");

  let query = supabase
    .from("reservation")
    .select(
      `id, lot_id, space_id, guest_phone, guest_car_num, start_at, end_at, pay_type, pay_method, amount
      ,status, created_at, parking_lots:lot_id(parking_name, address)`
    )
    .eq("guest_phone", phone)
    .order("created_at", {ascending:false});

  const {data, error} = await query;
  if(error) throw new Error("비회원 이용내역 조회 실패" + error.message);
  return data || [];
}

// 회원 -> 바로 조회 가능 
export const userReservationInfo = async(userId) =>{
  if (!userId) throw new Error("사용자 정보 없음");

  const {data, error} = await supabase
    .from("reservation")
    .select(
      `id, lot_id, space_id, user_id, start_at, end_at, pay_type, pay_method, amount, status,
      created_at, parking_lots:lot_id(parking_name, address), users:user_id(subs_type)`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("회원 이용내역 조회 실패: " + error.message);

  return data || [];
}

export const getReservationDetail = async ({reservationId, userId = null, phone = null}) => {
  if (!reservationId) throw new Error("예약 내역 조회 에러 - id없음");

  let query = supabase
    .from("reservation")
    .select(
      `id, lot_id, space_id, user_id, guest_phone, guest_car_num,
      start_at, end_at, pay_type, pay_method, amount, status, created_at,
      parking_lots:lot_id(parking_name, address),
      users:user_id(subs_type)`
    )
    .eq("id", reservationId);

  // 직접 URL 접근 방지: 회원이면 user_id로, 비회원이면 guest_phone으로 한번 더 필터링 함 
  if (userId) query = query.eq("user_id", userId);
  if (phone) query = query.eq("guest_phone", phone);

  // 둘 다 없으면 접근 막기
  if (!userId && !phone) throw new Error("조회 권한 없음");

  const { data, error } = await query.single();

  if (error) throw new Error("이용내역 상세 조회 실패: " + error.message);

  return data;  
}

//마이페이지 
// 상단 사용자 기본정보 api 
export const getProfile = async (userId) => {
  if(!userId) throw new Error("사용자 정보 없음");

  const {data, error} = await supabase
    .from("users")
    .select("id, car_num, subs_type")
    .eq("id", userId)
    .single();

  if (error) throw new Error("회원정보 조회 실패: " + error.message);

  return data;
  
}

//차량 정보 수정 
export const updateCarNum = async ({ userId, carNum }) => {
  if (!userId) throw new Error("사용자 정보 없음");
  if (!carNum) throw new Error("차량번호를 입력해주세요");

  const { data, error } = await supabase
    .from("users")
    .update({ car_num: carNum })
    .eq("id", userId)
    .select("id, car_num, subs_type")
    .single();

  if (error) throw new Error("차량정보 변경 실패: " + error.message);

  return data; // 업데이트된 프로필
}

// 간단한 이용 내역 api 
export const getLittleReservation = async(userId) => {
  if (!userId) throw new Error("사용자 정보 없음");

  const { data, error } = await supabase
    .from("reservation")
    .select("id, pay_type, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false }) // 최신 순
    .limit(5);                                 // 최대 5개

  if (error) {
    throw new Error("마이페이지 이용내역 조회 실패: " + error.message);
  }

  return data || [];
}

// 비회원 로그인 
// 1) guests 테이블에 (g_phone, g_car_num) insert (이미 있으면 그대로 사용)
// 2) return: { g_id, g_phone, g_car_num }  -> Context 저장용
export const guestLogin = async ({phone, carNum}) => {
  if(!phone) throw new Error("연락처 없음");
  if(!carNum) throw new Error("차량번호 없음");

  // 데이터 있는지 조회 
  const {data : exiting, error : findError} = await supabase
    .from("guests")
    .select(" g_id, g_phone, g_car_num")
    .eq("g_phone", phone)
    .eq("g_car_num", carNum)
    .maybeSingle();

  if(findError) throw new Error("비회원 로그인 실패" + findError.message);

  if(exiting) return exiting;
  
  //데이터 없으면 생성 
  const {data:created, error:insertError} = await supabase
    .from("guests")
    .insert({g_phone : phone, g_car_num : carNum})
    .select("g_id, g_phone, g_car_num")
    .single();

  if(insertError) throw new Error("비회원 로그인 실패(생성 에러)" + insertError.message);

  return created;
  
}

// 회원 로그인 
export const userLogin = async ({userId, password}) => {
  if(!userId) throw new Error("아이디 없음");
  if(!password) throw new Error("비밀번호 없음");

  const {data, error} = await supabase
    .from("users")
    .select("id, car_num, subs_type, phone, email")
    .eq("id", userId)
    .eq("password", password)
    .maybeSingle();

  if (error) throw new Error("회원 조회 실패: " + error.message);
  if (!data) throw new Error("아이디 또는 비밀번호가 틀림");

  return data;
}

//회원가입 
export const signUpUser = async ({ userId, password, phone, email, carNum }) => {

  // 사용자가 입력 안했을 경우 
  if (!userId) throw new Error("아이디 없음");
  if (!password) throw new Error("비밀번호 없음");
  if (!phone) throw new Error("연락처 없음");
  if (!carNum) throw new Error("차량번호 없음");
  // email은 NOT NULL이 아니라서 비워도 되지만, UI상 입력 받으니까 일단 검사
  if (!email) throw new Error("이메일 없음");

  // 이미 등록된 어쩌구 처리하기 (중복 체크)
  // duplicate id, phone, carNum 
  const { data: dupId } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (dupId) throw new Error("이미 사용중인 아이디");

  const { data: dupPhone } = await supabase
    .from("users")
    .select("phone")
    .eq("phone", phone)
    .maybeSingle();
  if (dupPhone) throw new Error("이미 등록된 연락처");

  const { data: dupCar } = await supabase
    .from("users")
    .select("car_num")
    .eq("car_num", carNum)
    .maybeSingle();
  if (dupCar) throw new Error("이미 등록된 차량번호");

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: userId,
      password,
      phone,
      email,
      car_num: carNum,
      subs_type: "none"
    })
    .select("id, car_num, subs_type, phone, email")
    .single();

  if (error) throw new Error("회원가입 실패: " + error.message);

  return data;
};




