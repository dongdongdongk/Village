// Village.js

const {
  StupidVillageAI,
  AdvancedVillageAI,
  TestVillageAI,
} = require("./VillageAI");
const { names } = require("./static");

// 생산 결과를 나타내는 클래스
class ProductionResult {
  constructor(success) {
    this.success = success; // 성공 여부
  }
}

class Village {
  constructor() {
    this.foodProduction = 0; // 작년 생산 식량
    this.foodConsumption = 0; // 작년 소비 식량
    this.era = this.getCivilizationEra();
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

    // 마을 번호
    this.villageNumber = null;

    // 마을 욕구
    this.expansionDesire = 0; // 영토확장
    this.expansionDesireCounter = 0;

    // 랜덤하게 AI 선택
    const aiClasses = [StupidVillageAI, TestVillageAI];
    const randomAI = aiClasses[Math.floor(Math.random() * aiClasses.length)];

    this.VillageAI = new randomAI(this); // 랜덤하게 선택된 VillageAI 인스턴스 생성 및 Village 인스턴스 전달

    setInterval(() => {
      this.VillageAI.manageJobProduction(); // VillageAI의 메서드 호출
      this.updatePopulation();
    }, 500);
  }

  // VillageManager로부터 받은 마을 번호를 설정하는 메서드
  setVillageNumber(number) {
    this.villageNumber = number;
  }

  generateName() {
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
      { level: 0, era: "원시 시대" },
      { level: 50000, era: "선사 시대" },
      { level: 100000, era: "고대 시대" },
      { level: 200000, era: "중세 시대" },
      { level: 350000, era: "르네상스 시대" },
      { level: 500000, era: "계몽주의 시대" },
      { level: 700000, era: "산업혁명 시대" },
      { level: 1000000, era: "제국주의 시대" },
      { level: 1500000, era: "근대 시대" },
      { level: 2000000, era: "현대 시대" },
      { level: 3000000, era: "탈지구 시대" },
      { level: 5000000, era: "우주 탐사 시대" },
      { level: 10000000, era: "인공지능 시대" },
      { level: 50000000, era: "초지능 시대" },
      { level: 200000000, era: "초차원 문명 시대" },
      { level: 1000000000, era: "다중우주 확장 시대" },
      { level: 10000000000, era: "완전한 기술 특이점 시대" },
    ];

    for (let i = civilizationLevels.length - 1; i >= 0; i--) {
      if (this.civilizationLevel >= civilizationLevels[i].level) {
        return civilizationLevels[i].era;
      }
    }
    // 기본적으로 원시 시대로 설정
    return "원시";
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
    const maxPopulation = this.territorySize * 1000;

    if (this.population > maxPopulation) {
      const populationDecrease = Math.floor(this.population * 0.1); // 현재 인구의 30%를 감소시킴
      let remainingPopulation = populationDecrease; // 분배되지 않은 나머지 인구

      // 각 직업별 인구 수에서 랜덤하게 분배
      while (remainingPopulation > 0) {
        const randomJobIndex = Math.floor(Math.random() * 4); // 0부터 3까지의 랜덤 인덱스
        let decreaseAmount = Math.ceil(remainingPopulation * Math.random()); // 분배될 양은 0부터 남은 인구 중 랜덤으로 결정

        // 선택된 직업의 인구 수가 감소량보다 크면 그만큼 감소시킴
        if (randomJobIndex === 0 && this.scientistCount >= decreaseAmount) {
          this.scientistCount -= decreaseAmount;
          remainingPopulation -= decreaseAmount;
        } else if (randomJobIndex === 1 && this.farmerCount >= decreaseAmount) {
          this.farmerCount -= decreaseAmount;
          remainingPopulation -= decreaseAmount;
        } else if (
          randomJobIndex === 2 &&
          this.soldierCount >= decreaseAmount
        ) {
          this.soldierCount -= decreaseAmount;
          remainingPopulation -= decreaseAmount;
        } else if (randomJobIndex === 3 && this.priestCount >= decreaseAmount) {
          this.priestCount -= decreaseAmount;
          remainingPopulation -= decreaseAmount;
        }
      }

      this.expansionDesire++;
      this.expansionDesireCounter++;

      if (this.expansionDesireCounter >= 100) {
        console.log(
          `마을의 영토 확장 욕구가 강해집니다! (현재 수치: ${this.expansionDesire})`
        );
        this.expansionDesireCounter = 0;
      }
    }

    const foodConsumption = this.lastYearPopulation;
    this.foodConsumption = foodConsumption;

    const maxFoodProduction = this.territorySize * 100;
    const foodProductionPerFarmer = this.getRandomProduction(5, 7);
    const foodProduction = Math.round(
      this.farmerCount * foodProductionPerFarmer
    );
    this.foodProduction = foodProduction;

    this.foodSupply += foodProduction - foodConsumption;

    // this.printFoodReport(foodProduction, foodConsumption);

    if (this.foodSupply < foodConsumption) {
      const foodShortage = foodConsumption - this.foodSupply;
      // this.printFoodShortageReport(foodShortage);

      this.foodSupply = 0;

      const deathCount = Math.min(this.population, foodShortage);
      this.distributeDeaths(deathCount);

      // if (this.population <= 0) {
      //   this.printExtinctionReport();
      //   this.village = null;
      // }
    }

    this.scienceLevel += this.scientistCount * 0.1;
    this.civilizationLevel += Math.floor(this.population * 0.1);

    this.lastYearPopulation = this.population;

    this.year++;
    // this.printPrimitiveAndAncientEraImage(era);
    // this.printNewLines();
  }

  extinguish() {
    console.log("|+++++++++++++++++++++++++++++++++++++│");
    console.log("│─────────────────────────────────────│");
    console.log(`│ ${this.name} 마을이 식량 부족으로 멸망하였습니다.`);
    console.log("│─────────────────────────────────────│");
  }

  printVillageInfo() {
    console.log(`\n ${this.year}년도`);
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
    console.log(`│ 문명 시대: ${this.getCivilizationEra()}(${this.scienceLevel})`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 정치 체제: ${this.politicalSystem}`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 현재 사용 중인 AI: ${this.VillageAI.constructor.name}`);
    console.log("│─────────────────────────────────────│");
  }

  printJobCounts() {
    console.log("│ 직업별 인구 수:");
    console.log(`│ 과학자: ${this.scientistCount}`);
    console.log(`│ 농부: ${this.farmerCount}`);
    console.log(`│ 군인: ${this.soldierCount}`);
    console.log(`│ 사제: ${this.priestCount}`);
    console.log("│─────────────────────────────────────│");
  }

  printFoodReport() {
    // 저장된 식량 생산량과 소비량을 출력
    console.log("│ 식량 생산 및 소비 보고");
    console.log("│─────────────────────────────────────│");
    console.log(`│ 작년 ${this.foodProduction}의 식량을 생산했습니다.`);
    console.log(`│ 작년 ${this.foodConsumption}의 식량을 소비했습니다.`);
    console.log("│─────────────────────────────────────│");
  }

  printFoodShortageReport(foodShortage) {
    console.log("│─────────────────────────────────────│");
    console.log("│ 식량 부족 보고");
    console.log("│─────────────────────────────────────│");
    console.log(
      `│ 작년 ${foodShortage} 명의 인구가 식량 부족으로 인해 사망하였습니다.`
    );
    console.log("│─────────────────────────────────────│");
  }

  // extinguish() {
  //   console.log("|+++++++++++++++++++++++++++++++++++++│");
  //   console.log("│─────────────────────────────────────│");
  //   console.log(`│ ${this.name} 마을이 식량 부족으로 멸망하였습니다.`);
  //   console.log("│─────────────────────────────────────│");
  //   // 마을 멸망 이벤트를 VillageManager에 전달할 때 현재 객체를 매개변수로 전달합니다.
  //   this.onExtinguish(this);
  // }

  printPrimitiveAndAncientEraImage() {
    const era = this.era;
    if (era === "원시" || era === "고대") {
      console.log(`
                      |   _   _
                . | . x .|.|-|.|
             |\ ./.\-/.\-|.|.|.|
          ~~~|.|_|.|_|.|.|.|_|.|~~~
                `);
    }
  }

  printNewLines() {
    for (let i = 0; i < 9; i++) {
      console.log(" ");
    }
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
      if (deathCount <= 0) break;

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
      this.extinguish();
    }

    // if (this.population <= 0) {
    //   this.printExtinctionReport();
    //         // VillageManager에게 해당 마을을 삭제하도록 요청
    //   const villageIndex = VillageManager.villages.indexOf(this);
    //   VillageManager.removeVillage(villageIndex);
    //   this.village = null;

    // }
  }

  produceScientist(count) {
    const scientistCost = 100 * count;
    if (this.foodSupply >= scientistCost) {
      this.foodSupply -= scientistCost;
      this.scientistCount += count;
      return new ProductionResult(true);
    } else {
      return new ProductionResult(false);
    }
  }

  produceFarmer(count) {
    const farmerCost = 50 * count;
    if (this.foodSupply >= farmerCost) {
      this.foodSupply -= farmerCost;
      this.farmerCount += count;
      return new ProductionResult(true);
    } else {
      return new ProductionResult(false);
    }
  }

  produceSoldier(count) {
    const soldierCost = 150 * count;
    if (this.foodSupply >= soldierCost) {
      this.foodSupply -= soldierCost;
      this.soldierCount += count;
      return new ProductionResult(true);
    } else {
      return new ProductionResult(false);
    }
  }

  producePriest(count) {
    const priestCost = 80 * count;
    if (this.foodSupply >= priestCost) {
      this.foodSupply -= priestCost;
      this.priestCount += count;
      return new ProductionResult(true);
    } else {
      return new ProductionResult(false);
    }
  }
}

module.exports = Village;
