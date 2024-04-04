class Village {
  constructor() {
    this.name = this.generateName(); // 마을 이름 생성
    this.territorySize = this.generateTerritorySize(); // 영토 크기
    this.happiness = 50; // 행복도
    this.year = 0; // 현재 년도 초기화
    this.civilizationLevel = 0; // 문명 발전도 초기화 (처음에는 0으로 시작하여 원시 시대)
    this.foodSupply = 200;
    this.population = 100; // 초기 인구는 100명으로 설정
    this.birthRate = 0.03; //0.03 출산율: 연간 각 여성당 평균 출생하는 아이의 수
    this.deathRate = 0.01; // 사망률: 연간 전체 인구 중 사망하는 비율

    // 직업별 인구 수 설정
    this.scientistCount = 0;
    this.farmerCount = 0;
    this.soldierCount = 0;
    this.priestCount = 0;

    // 정치 체제 랜덤 선택
    this.politicalSystem = this.getRandomPoliticalSystem();

    // 직업 분배
    this.distributeJobs();

    // 초기 과학 수준
    this.scienceLevel = 0;

    // 주기적으로 인구 및 직업 분배 업데이트
    setInterval(() => {
      this.updatePopulation();
    }, 1000);
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

  // 랜덤 정치 체제 선택 메서드
  getRandomPoliticalSystem() {
    const politicalSystems = [
      "군사주의",
      "과학주의",
      "농경주의",
      "종교주의",
      "민주주의",
    ];
    return politicalSystems[
      Math.floor(Math.random() * politicalSystems.length)
    ];
  }

  // 문명 시대 출력 메서드
  getCivilizationEra() {
    const civilizationLevels = [
      { level: 0, era: "원시" },
      { level: 10000, era: "고대" },
      { level: 20000, era: "중세" },
      { level: 30000, era: "근대" },
      { level: 40000, era: "현대" },
    ];

    for (let i = civilizationLevels.length - 1; i >= 0; i--) {
      if (this.civilizationLevel >= civilizationLevels[i].level) {
        return civilizationLevels[i].era;
      }
    }
  }

  // 랜덤한 비율 변경을 생성하는 메서드
getRandomRateChange(min, max) {
  return Math.random() * (max - min) + min;
}

  // 랜덤한 생산량을 생성하는 메서드
  getRandomProduction(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updatePopulation() {

    // 출산율과 사망률에 랜덤성 추가
    this.birthRate += this.getRandomRateChange(-0.001, 0.002);
    this.deathRate += this.getRandomRateChange(-0.001, 0.001);

    this.happiness -= 0.1;
    this.birth();
    this.death();
    const foodConsumption = this.population; // 인구 수만큼의 식량 소비량 계산

    let maxFoodProduction = this.territorySize * 100;
    const foodProductionPerFarmer = this.getRandomProduction(1, 4) // 농부 한 명이 만들어내는 평균 식량 생산량
    let foodProduction = Math.round(this.farmerCount * foodProductionPerFarmer); // 농부들이 만들어낸 식량 생산량 계산

    // 생산량 한계
    if (foodProduction > maxFoodProduction) {
      foodProduction = maxFoodProduction;
    }

    // 식량 생산
    this.foodSupply += foodProduction - foodConsumption;
    console.log(foodProduction, " 의 식량을 생산했습니다.");

    // 식량 부족으로 인한 사망 확인 및 처리
    if (this.foodSupply < 0) {
      const populationDecrease = Math.abs(this.foodSupply); // 부족한 식량의 절대값을 인구 감소로 설정
      this.population -= populationDecrease; // 인구를 감소시킴
      console.log(
        `${populationDecrease} 명이 식량 부족으로 인해 사망하였습니다.`
      );
      this.foodSupply = 0; // 음수 식량 공급량을 0으로 설정
    }

    this.scienceLevel += this.scientistCount * 10;
    this.civilizationLevel += Math.floor(this.population * 0.1);

    this.distributeJobs();

    const era = this.getCivilizationEra();
    console.log(
      `${this.year}년도 - 마을 이름: ${this.name}, 영토 크기: ${this.territorySize}, 현재 인구: ${this.population}명, 식량 : ${this.foodSupply} 행복도: ${this.happiness}%, 문명 시대: ${era}, 정치 체제: ${this.politicalSystem}`
    );

    this.printJobCounts();

    if (era === "원시") {
      console.log(`
                    |   _   _
              . | . x .|.|-|.|
           |\ ./.\-/.\-|.|.|.|
        ~~~|.|_|.|_|.|.|.|_|.|~~~
              `);
    }

    // 인구가 0이 되면 마을 멸망 출력
    if (this.population === 0) {
      console.log(`${this.name} 마을이 멸망하였습니다.`);
    }

    this.year++;
  }

  // 직업별 인구 수 출력 메서드
  printJobCounts() {
    console.log("직업별 인구 수:");
    console.log(`과학자: ${this.scientistCount}`);
    console.log(`농부: ${this.farmerCount}`);
    console.log(`군인: ${this.soldierCount}`);
    console.log(`종교인: ${this.priestCount}`);
  }

  // 출생 처리 메서드
  birth() {
    const births = Math.floor(this.population * this.birthRate); // 출생 수 계산
    this.population += births; // 인구 증가
    console.log(births, " 명이 태어났습니다.");

    // 새로운 출생으로 인한 직업 분배
    this.distributeJobs();
  }

  // 사망 처리 메서드
  death() {
    const deaths = Math.floor(this.population * this.deathRate); // 사망 수 계산
    this.population -= deaths; // 인구 감소
    console.log(deaths, " 명이 사망하였습니다");
  }

  // 직업 분배 메서드
  distributeJobs() {
    // 각 직업에 대한 비율 설정
    let scientistRatio, farmerRatio, soldierRatio, priestRatio;
    switch (this.politicalSystem) {
      case "군사주의":
        scientistRatio = 0.1;
        farmerRatio = 0.2;
        soldierRatio = 0.5;
        priestRatio = 0.2;
        break;
      case "과학주의":
        scientistRatio = 0.4;
        farmerRatio = 0.2;
        soldierRatio = 0.1;
        priestRatio = 0.3;
        break;
      case "농경주의":
        scientistRatio = 0.2;
        farmerRatio = 0.5;
        soldierRatio = 0.1;
        priestRatio = 0.2;
        break;
      case "종교주의":
        scientistRatio = 0.1;
        farmerRatio = 0.2;
        soldierRatio = 0.1;
        priestRatio = 0.6;
        break;
      case "민주주의":
        scientistRatio = 0.25;
        farmerRatio = 0.25;
        soldierRatio = 0.25;
        priestRatio = 0.25;
        break;
      default:
        scientistRatio = 0.2;
        farmerRatio = 0.4;
        soldierRatio = 0.3;
        priestRatio = 0.1;
        break;
    }

    // 직업별 인구 수 계산 및 설정
    this.scientistCount = Math.floor(this.population * scientistRatio);
    this.farmerCount = Math.floor(this.population * farmerRatio);
    this.soldierCount = Math.floor(this.population * soldierRatio);
    this.priestCount = Math.floor(this.population * priestRatio);
  }
}

module.exports = Village;
