const {
  StupidVillageAI,
  AdvancedVillageAI,
  TestVillageAI,
} = require("./VillageAI");

class Village {
  constructor() {
    this.name = this.generateName();
    this.territorySize = this.generateTerritorySize();
    this.happiness = 100;
    this.year = 0;
    this.civilizationLevel = 0;
    this.foodSupply = 2000;
    this.population = 100;
    this.lastYearPopulation = this.population;
    this.birthRate = 0.03;
    this.deathRate = 0.01;

    this.scientistCount = 0;
    this.farmerCount = 200;
    this.soldierCount = 0;
    this.priestCount = 0;

    this.politicalSystem = this.getRandomPoliticalSystem();

    this.scienceLevel = 0;

    // 랜덤하게 AI 선택
    const aiClasses = [StupidVillageAI, TestVillageAI];
    const randomAI = aiClasses[Math.floor(Math.random() * aiClasses.length)];
    // 선택된 AI 클래스 이름 출력
    // console.log('│─────────────────────────────────────│');
    // console.log(`│ 현재 사용 중인 AI: ${randomAI.name}`);
    // console.log('│─────────────────────────────────────│');

    this.VillageAI = new randomAI(this); // 랜덤하게 선택된 VillageAI 인스턴스 생성 및 Village 인스턴스 전달

    setInterval(() => {
      this.VillageAI.manageJobProduction(); // VillageAI의 메서드 호출
      this.updatePopulation();
    }, 500);
  }

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

  generateTerritorySize() {
    return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  }

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

  getRandomProduction(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updatePopulation() {
    this.population =
      this.scientistCount +
      this.farmerCount +
      this.soldierCount +
      this.priestCount;
    const era = this.getCivilizationEra();
    // 박스 시작
    console.log(` ${this.year}년도`);
    console.log("───────────────────────────────────────");
    console.log(`│ 마을 이름: ${this.name}`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 직업별 인구 수 `);
    console.log("│─────────────────────────────────────│");
    console.log(
      `│ 과학자: ${this.scientistCount}, 농부: ${this.farmerCount}, 군인: ${this.soldierCount}, 사제: ${this.priestCount}`
    );
    console.log("│─────────────────────────────────────│");
    console.log(`│ 영토 크기: ${this.territorySize}`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 현재 인구: ${this.population}명`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 식량 : ${this.foodSupply}`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 행복도: ${this.happiness}%`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 문명 시대: ${era}`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 정치 체제: ${this.politicalSystem}`);
    console.log("│─────────────────────────────────────│");
    console.log("│─────────────────────────────────────│");
    console.log(`│ 현재 사용 중인 AI: ${this.VillageAI.constructor.name}`);
    console.log("│─────────────────────────────────────│");
    // 박스 끝

    // this.printJobCounts();

    const maxPopulation = this.territorySize * 1000; // 최대 수용 인구 계산
    const populationExcess = this.population - maxPopulation; // 초과 인구 계산
    
    if (populationExcess > 0) {
      // 초과 인구만큼 행복도 감소
      const excessHappinessDecrease = populationExcess * 0.01; // 초과 인구 1000 당 1%씩 감소
      this.happiness -= excessHappinessDecrease;
    
      // 행복도가 0 이하로 내려가면 식량 생산량의 3분에 1이 감소
      if (this.happiness <= 0) {
        const foodProductionDecrease = Math.floor(this.foodProduction * (1 / 3));
        this.foodProduction -= foodProductionDecrease;
        console.log(`식량 생산량이 ${foodProductionDecrease} 감소했습니다.`);
      }
    } else {
      // 초과 인구가 없으면 기존 행복도 감소 로직 유지
      this.happiness -= 0.1;
    }
    // 사제가 매턴마다 0.1만큼 행복을 추가
    this.happiness += 0.01 * this.priestCount;
    
    // 행복도가 100을 넘지 못하게 조정
    this.happiness = Math.min(this.happiness, 100);


    const foodConsumption = this.lastYearPopulation;

    const maxFoodProduction = this.territorySize * 100;
    const foodProductionPerFarmer = this.getRandomProduction(5, 7);
    const foodProduction = Math.round(
      this.farmerCount * foodProductionPerFarmer
    );

    this.foodSupply += foodProduction - foodConsumption;

    // 박스 시작
    console.log("│─────────────────────────────────────│");
    console.log("│ 식량 생산 및 소비 보고   ");
    console.log("│─────────────────────────────────────│");
    console.log(`│ 작년 ${foodProduction} 의 식량을 생산했습니다.`);
    console.log(`│ 작년 ${foodConsumption} 의 식량을 소비했습니다.`);
    console.log("│─────────────────────────────────────│");
    // 박스 끝

    if (this.foodSupply < foodConsumption) {
      const foodShortage = foodConsumption - this.foodSupply;
      // 박스 시작
      console.log("│─────────────────────────────────────│");
      console.log("│ 식량 부족 보고          │");
      console.log("│─────────────────────────────────────│");
      console.log(
        `│ 작년 ${foodShortage} 명의 인구가 식량 부족으로 인해 사망하였습니다.`
      );
      console.log("│─────────────────────────────────────│");
      // 박스 끝
      this.foodSupply = 0;

      const deathCount = Math.min(this.population, foodShortage);
      this.distributeDeaths(deathCount);

      if (this.population <= 0) {
        console.log(`${this.name} 마을이 멸망하였습니다.`);
        clearInterval(this.intervalId);
        process.exit();
      }
    }

    this.scienceLevel += this.scientistCount * 10;
    this.civilizationLevel += Math.floor(this.population * 0.1);

    this.lastYearPopulation = this.population;

    this.year++;
    if (era === "원시") {
      console.log(`
                      |   _   _
                . | . x .|.|-|.|
             |\ ./.\-/.\-|.|.|.|
          ~~~|.|_|.|_|.|.|.|_|.|~~~
                `);
    }

    if (era === "고대") {
      console.log(`
                      |   _   _
                . | . x .|.|-|.|
             |\ ./.\-/.\-|.|.|.|
          ~~~|.|_|.|_|.|.|.|_|.|~~~
                `);
    }

    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
  }

  printJobCounts() {
    console.log("직업별 인구 수:");
    console.log(`과학자: ${this.scientistCount}`);
    console.log(`농부: ${this.farmerCount}`);
    console.log(`군인: ${this.soldierCount}`);
    console.log(`종교인: ${this.priestCount}`);
  }
  distributeDeaths(deathCount) {
    const jobs = [
      this.scientistCount,
      this.farmerCount,
      this.soldierCount,
      this.priestCount,
    ];
    const totalPopulation = this.population;

    for (let i = 0; i < jobs.length; i++) {
      if (deathCount <= 0) break; // 사망자가 더 이상 없으면 종료

      const ratio = jobs[i] / totalPopulation;
      const deaths = Math.ceil(deathCount * ratio);

      switch (i) {
        case 0:
          this.scientistCount -= deaths;
          break;
        case 1:
          this.farmerCount -= deaths;
          break;
        case 2:
          this.soldierCount -= deaths;
          break;
        case 3:
          this.priestCount -= deaths;
          break;
      }

      deathCount -= deaths;
    }

    if (this.population <= 0) {
      // 박스 시작
      console.log("|+++++++++++++++++++++++++++++++++++++│");
      console.log("│─────────────────────────────────────│");
      console.log(`│ ${this.name} 마을이 식량 부족으로 멸망하였습니다.    `);
      console.log("│─────────────────────────────────────│");
      // 박스 끝
      clearInterval(this.intervalId);
      process.exit();
    }
  }

  produceScientist(count) {
    const scientistCost = 100 * count;
    if (this.foodSupply >= scientistCost) {
      this.foodSupply -= scientistCost;
      this.scientistCount += count;
      console.log(`${count}명의 과학자가 생산되었습니다.`);
    } else {
      // console.log(`식량 부족으로 과학자를 생산할 수 없습니다.`);
    }
  }

  produceFarmer(count) {
    const farmerCost = 50 * count;
    if (this.foodSupply >= farmerCost) {
      this.foodSupply -= farmerCost;
      this.farmerCount += count;
      console.log(`${count}명의 농부가 생산되었습니다.`);
    } else {
      // console.log(`식량 부족으로 농부를 생산할 수 없습니다.`);
    }
  }

  produceSoldier(count) {
    const soldierCost = 150 * count;
    if (this.foodSupply >= soldierCost) {
      this.foodSupply -= soldierCost;
      this.soldierCount += count;
      console.log(`${count}명의 군인이 생산되었습니다.`);
    } else {
      // console.log(`식량 부족으로 군인을 생산할 수 없습니다.`);
    }
  }

  producePriest(count) {
    const priestCost = 80 * count;
    if (this.foodSupply >= priestCost) {
      this.foodSupply -= priestCost;
      this.priestCount += count;
      console.log(`${count}명의 종교인이 생산되었습니다.`);
    } else {
      // console.log(`식량 부족으로 종교인을 생산할 수 없습니다.`);
    }
  }
}

module.exports = Village;
