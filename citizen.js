// 직업 상수 정의
const Jobs = {
    SCIENTIST: '과학자',
    FARMER: '농부',
    PRIEST: '종교인',
    SOLDIER: '군인',
    UNEMPLOYED: '무직'
  };
  
  // 직업별 확률 설정
  const JobProbabilities = {
    [Jobs.FARMER]: 60,   // 농부가 될 확률: 40%
    [Jobs.SOLDIER]: 20,  // 군인이 될 확률: 30%
    [Jobs.SCIENTIST]: 10,// 과학자가 될 확률: 20%
    [Jobs.PRIEST]: 10    // 종교인이 될 확률: 10%
  };
  
  // Citizen 클래스 정의
  class Citizen {
    constructor(name, age, gender, village) {
      this.name = name; // 시민 이름
      this.age = age; // 시민 나이
      this.gender = gender; // 시민 성별
      this.village = village; // 시민이 속한 마을 객체
      this.job = Jobs.UNEMPLOYED; // 시민의 직업 (초기값은 무직으로 설정)
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
  
    // 시민의 나이를 증가시키고, 사망 여부 및 출산 여부를 확인하는 메서드
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
  
      // 출산 가능 여부 확인
      if (this.age >= 20 && this.age <= 40 && this.gender === "여성") {
        this.giveBirth();
      }
  
      // 직업 선택
      if (this.age === 20) {
        this.selectJob();
      }
  
      return false; // 사망하지 않은 경우
    }
  
    // 직업 선택 메서드
    selectJob() {
      const rand = Math.random() * 100; // 0부터 99 사이의 랜덤한 값
      let cumulativeProbability = 0;
  
      // 각 직업별 확률을 고려하여 무작위로 선택
      for (const job in JobProbabilities) {
        cumulativeProbability += JobProbabilities[job];
        if (rand < cumulativeProbability) {
          this.job = job;
          break;
        }
      }
    }
  
    // 출산 메서드
    giveBirth() {
      // 20대 여성 시민이 출산할 확률 (예: 10%)
      const birthProbability = 60;
  
      // 남성 시민 중 20대 부부를 찾음
      const availableMales = this.village.citizens.filter(
        (citizen) => citizen.age >= 20 && citizen.age <= 40 && citizen.gender === "남성"
      );
  
      // 부부가 있는 경우에만 출산 가능
      if (availableMales.length > 0) {
        // 출산 확률 계산
        const randomValue = Math.random() * 100;
        if (randomValue < birthProbability) {
          // 아기 이름 생성
          const babyName = this.village.generateRandomName();
  
          // 아기 성별 결정
          const babyGender = Math.random() < 0.5 ? "남성" : "여성";
  
          // 아기 추가
          this.village.addCitizen(babyName, 1, babyGender);
        }
      }
    }
  
    // 시민 정보를 문자열로 반환하는 메서드
    getInfo() {
      return `이름: ${this.name}, 나이: ${this.age}, 성별: ${this.gender}, 직업: ${this.job}, 속한 마을: ${this.village.name}`;
    }
  }
  
  module.exports = Citizen;
  