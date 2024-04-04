// Citizen 클래스 정의
class Citizen {
  constructor(name, age, gender, village) {
    this.name = name; // 시민 이름
    this.age = age; // 시민 나이
    this.gender = gender; // 시민 성별
    this.village = village; // 시민이 속한 마을 객체
  }

  // 시민의 사망 여부를 결정하는 메서드
  isDead() {
    // 사망 확률 초기값 설정
    let deathProbability = 0;

    // 60세 이전: 약 1%에서 5%의 사망률
    if (this.age < 60) {
      deathProbability = Math.floor(Math.random() * 5) + 1;
    }
    // 60세 이후: 점진적으로 증가하는 사망률
    else {
      // 연령에 따른 사망률 계산
      deathProbability = this.calculateDeathProbability();
    }

    // 사망 여부 반환
    return Math.random() * 100 < deathProbability;
  }

  // 연령에 따른 사망률 계산 메서드
  calculateDeathProbability() {
    // 평균적인 수명 설정 (예: 80세)
    const averageLifespan = 80;

    // 60세 이후부터 사망률이 100%에 도달하는 나이까지의 범위
    const maxAge = 100;

    // 현재 나이에서 평균적인 수명을 뺀 값
    const diff = this.age - averageLifespan;

    // 현재 나이에서 평균적인 수명을 뺀 값이 0 이하이면 사망 확률은 0%가 됨
    if (diff <= 0) {
      return 0;
    }

    // 사망 확률 계산
    // 현재 나이에서 평균적인 수명을 뺀 값이 100 이상이면 사망 확률은 100%가 됨
    if (this.age >= maxAge) {
      return 100;
    }

    // 현재 나이에서 평균적인 수명을 뺀 값에 따라 사망률이 증가함
    return Math.min((diff / (maxAge - averageLifespan)) * 100, 100);
  }

  // 시민의 나이를 증가시키고, 사망 여부를 확인하는 메서드
  growOld() {
    this.age++; // 시민의 나이를 증가

    // 시민이 사망할 경우
    if (this.isDead()) {
      // 해당 시민 객체를 속한 마을에서 제거
      const index = this.village.citizens.indexOf(this);
      if (index !== -1) {
        this.village.citizens.splice(index, 1);
      }
      return true; // 사망 여부 반환
    }
    return false; // 사망하지 않은 경우
  }

  // 시민 정보를 문자열로 반환하는 메서드
  getInfo() {
    return `이름: ${this.name}, 나이: ${this.age}, 성별: ${this.gender}, 속한 마을: ${this.village.name}`;
  }
}

// Village 클래스 정의
class Village {
  constructor() {
    this.name = this.generateName(); // 마을 이름 생성
    this.territorySize = this.generateTerritorySize(); // 영토 크기
    this.happiness = 50; // 행복도
    this.citizens = []; // 시민 배열
    this.year = new Date().getFullYear(); // 현재 년도 초기화

    // 초기 시민 생성 및 추가
    for (let i = 0; i < 100; i++) {
      const gender = Math.random() < 0.5 ? "남성" : "여성"; // 랜덤하게 성별 설정
      const age = Math.floor(Math.random() * 21) + 10; // 랜덤하게 나이 설정 (10~30)
      const name = this.generateRandomName(); // 랜덤하게 이름 설정
      this.addCitizen(name, age, gender); // 시민 추가
    }

    // 초기 인구 설정
    this.population = this.citizens.length; // 초기 인구는 시민 배열의 길이로 설정
  }

  // 마을 이름 생성 메서드
  generateName() {
    const names = [
      "서울",
      "뉴욕",
      "도쿄",
      "런던",
      "파리",
      "베를린",
      "상파울로",
      "모스크바",
      "베이징",
      "카이로",
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  // 영토 크기 생성 메서드
  generateTerritorySize() {
    return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  }

  // 랜덤하게 시민 이름 생성 메서드
  generateRandomName() {
    const firstName = [
      "김",
      "이",
      "박",
      "최",
      "정",
      "강",
      "조",
      "윤",
      "장",
      "임",
    ];
    const lastName = [
      "민준",
      "서연",
      "시우",
      "하윤",
      "지우",
      "서준",
      "지민",
      "수아",
      "지유",
      "민재",
    ];
    return (
      firstName[Math.floor(Math.random() * firstName.length)] +
      lastName[Math.floor(Math.random() * lastName.length)]
    );
  }

  // 인구 업데이트 메서드
  updatePopulation() {
    // 인구 증가 또는 감소 없음

    // 시민들의 나이를 증가시키고, 사망 여부 확인
    this.citizens.forEach((citizen) => {
      citizen.growOld(); // 시민의 나이를 증가시키고, 사망 여부 확인
    });

    // 행복도 감소
    this.happiness -= 0.1;

    // 현재 년도 출력
    console.log(
      `${this.year}년도 - 마을 이름: ${this.name}, 영토 크기: ${this.territorySize}, 현재 인구: ${this.citizens.length}명, 행복도: ${this.happiness}%`
    );

    // 시민 정보 출력
    this.citizens.forEach((citizen) => {
      console.log(citizen.getInfo());
    });

    // 현재 년도 증가
    this.year++;

    // 다음 인구 업데이트 호출
    setTimeout(() => {
      this.updatePopulation();
    }, 1000); // 1초 후에 재귀적으로 호출
  }

  // 시민 추가 메서드
  addCitizen(name, age, gender) {
    const newCitizen = new Citizen(name, age, gender, this);
    this.citizens.push(newCitizen);
  }

  // 게임 시작 메서드
  startGame() {
    // 인구 업데이트 메서드 호출
    this.updatePopulation();
  }
}

// 테스트용 하나의 마을 생성
const village = new Village();

// 마을의 게임 시작
village.startGame();
