class VillageAI {
  constructor(village) {
    this.village = village;
    this.minFoodStorage = this.village.population * 2; // 최소한 필요한 식량 저장량 (인구의 두 배)
  }

  /**
   * 각 직업을 적절하게 조정하여 마을이 멸망하지 않도록 함
   * 이 메서드는 하위 클래스에서 오버라이딩되어야 함
   */
  manageJobProduction() {
    // 하위 클래스에서 오버라이딩되어야 함
  }
}

class StupidVillageAI extends VillageAI {
  constructor(village) {
    super(village); // VillageAI 클래스의 생성자 호출하여 초기화
  }

  /**
   * 직업 생산을 관리하는 메서드
   * 이 메서드는 상위 클래스에서 정의된 manageJobProduction() 메서드를 오버라이딩합니다.
   */
  manageJobProduction() {
    this.manageStandardJobProduction(); // 표준 직업 생산 관리 함수 호출
  }

  /**
   * 표준 직업 생산 관리 함수
   * 이 함수에서는 각 직업의 생산을 관리합니다.
   */
  manageStandardJobProduction() {
    // 농부 부족분 계산
    const farmerShortage = this.stopJobProduction(); // stopJobProduction() 메서드 호출하여 farmerShortage 변수에 할당

    // 각 직업의 생산량을 서로 다르게 더해줍니다.
    if (this.village.foodSupply > 0) {
      // 식량 부족이 아니라면
      const scientistRandomValue = Math.floor(Math.random() * 5) + 1; // 1부터 5까지의 랜덤값 생성
      const priestRandomValue = Math.floor(Math.random() * 5) + 1; // 1부터 5까지의 랜덤값 생성
      const soldierRandomValue = Math.floor(Math.random() * 5) + 1; // 1부터 5까지의 랜덤값 생성
      const farmerRandomValue = Math.floor(Math.random() * 5) + 1;
      this.village.produceScientist(scientistRandomValue);
      this.village.producePriest(priestRandomValue);
      this.village.produceSoldier(soldierRandomValue);
      this.village.produceFarmer(farmerRandomValue);
    }

    // 과학자 생산 필요량 계산
    const scientistNeeded = Math.ceil(this.village.population * 0.8);
    const scientistShortage = scientistNeeded - this.village.scientistCount;
    if (scientistShortage > 0) {
      this.village.produceScientist(scientistShortage); // 부족한 과학자 생산
    }

    // 행복도가 낮을 때 사제 생산
    if (this.village.happiness < 30) {
      const priestNeeded = Math.ceil(this.village.population * 0.05);
      const priestShortage = priestNeeded - this.village.priestCount;
      if (priestShortage > 0) {
        this.village.producePriest(priestShortage); // 부족한 사제 생산
      }
    }

    // 군인 생산 필요량 계산
    const soldierNeeded = Math.ceil(this.village.population * 0.6);
    const soldierShortage = soldierNeeded - this.village.soldierCount;
    if (soldierShortage > 0) {
      this.village.produceSoldier(soldierShortage); // 부족한 군인 생산
    }

    // 농부의 생산을 증가시킵니다.
    const farmerSurplus = Math.floor(
      (this.village.foodSupply - this.minFoodStorage) / 6
    );
    if (farmerSurplus > 0) {
      this.village.produceFarmer(farmerSurplus); // 농부 생산 증가
    }

    // 인구 증가를 위해 최대한 많은 직업 생산
    let maxJobToProduce = Math.min(
      Math.ceil(this.village.population * 0.5), // 인구의 반만큼의 과학자 생산
      Math.ceil(this.village.population * 0.05), // 인구의 5%만큼의 사제 생산
      Math.ceil(this.village.population * 0.6) // 인구의 60%만큼의 군인 생산
    );

    if (maxJobToProduce <= 0) return; // 생산할 직업이 없으면 종료

    maxJobToProduce -= Math.min(maxJobToProduce, farmerSurplus || 0); // 농부가 생산한만큼 maxJobToProduce를 조정합니다.

    if (maxJobToProduce > 0) {
      // 다른 직업 생산
      this.village.produceScientist(maxJobToProduce);
      this.village.producePriest(maxJobToProduce);
      this.village.produceSoldier(maxJobToProduce);
    }
  }

  /**
   * 직업 생산을 중단하지 않고 농부만을 생산하는 메서드
   * 지난 해 인구와 식량으로부터 농부 부족분을 계산하여 농부를 생산합니다.
   */
  stopJobProduction() {
    const farmerShortage = Math.ceil(
      (this.village.lastYearPopulation - this.village.foodSupply) / 10
    ); // 농부 부족분 계산
    if (farmerShortage > 0) {
      this.village.produceFarmer(farmerShortage); // 부족한 농부 생산
    }
    return farmerShortage; // farmerShortage 반환
  }
}

class TestVillageAI extends VillageAI {
  constructor(village) {
    super(village); // VillageAI 클래스의 생성자 호출하여 초기화
  }

  /**
   * 직업 생산을 관리하는 메서드
   * 이 메서드는 상위 클래스에서 정의된 manageJobProduction() 메서드를 오버라이딩합니다.
   */
  manageJobProduction() {
    this.manageStandardJobProduction(); // 표준 직업 생산 관리 함수 호출
  }

  /**
   * 표준 직업 생산 관리 함수
   * 이 함수에서는 각 직업의 생산을 관리합니다.
   */
  manageStandardJobProduction() {
    // 농부 부족분 계산
    const farmerShortage = this.stopJobProduction(); // stopJobProduction() 메서드 호출하여 farmerShortage 변수에 할당

    if (this.village.foodSupply > this.village.population * 5) {
        // 식량의 절반을 각 직업에 맞게 분배하여 생산
        const foodToDistribute = Math.floor(this.village.foodSupply); // 식량의 절반
        const scientistFoodRatio = 0.2; // 과학자에 할당할 비율
        const priestFoodRatio = 0.2; // 사제에 할당할 비율
        const soldierFoodRatio = 0.3; // 군인에 할당할 비율
        const farmerFoodRatio = 0.3; // 농부에 할당할 비율
    
        // 각 직업별로 할당할 식량 양 계산
        const scientistFoodAmount = Math.floor(foodToDistribute * scientistFoodRatio);
        const priestFoodAmount = Math.floor(foodToDistribute * priestFoodRatio);
        const soldierFoodAmount = Math.floor(foodToDistribute * soldierFoodRatio);
        const farmerFoodAmount = Math.floor(foodToDistribute * farmerFoodRatio);
    
        // 각 직업에 할당된 식량을 이용하여 직업 추가
        const addedScientists = Math.floor(scientistFoodAmount / 100);
        const addedPriests = Math.floor(priestFoodAmount / 80);
        const addedSoldiers = Math.floor(soldierFoodAmount / 150);
        const addedFarmers = Math.floor(farmerFoodAmount / 50);
    
        this.village.produceScientist(addedScientists);
        this.village.producePriest(addedPriests);
        this.village.produceSoldier(addedSoldiers);
        this.village.produceFarmer(addedFarmers);
    
        console.log("식량이 풍족해서 적극적으로 AI 가 구입")
        // console.log(`${addedScientists}명의 과학자, ${addedPriests}명의 사제, ${addedSoldiers}명의 군인, ${addedFarmers}명의 농부가 추가되었습니다.`);
    } else if (this.village.foodSupply > 0) {
      // 식량 부족이 아니라면
      const scientistRandomValue = Math.floor(Math.random() * 5) + 1; // 1부터 5까지의 랜덤값 생성
      const priestRandomValue = Math.floor(Math.random() * 5) + 1; // 1부터 5까지의 랜덤값 생성
      const soldierRandomValue = Math.floor(Math.random() * 5) + 1; // 1부터 5까지의 랜덤값 생성
      const farmerRandomValue = Math.floor(Math.random() * 5) + 1;
      this.village.produceScientist(scientistRandomValue);
      this.village.producePriest(priestRandomValue);
      this.village.produceSoldier(soldierRandomValue);
      this.village.produceFarmer(farmerRandomValue);
    }
    // 각 직업의 생산량을 서로 다르게 더해줍니다.
    


    // 과학자 생산 필요량 계산
    const scientistNeeded = Math.ceil(this.village.population * 0.3);
    const scientistShortage = scientistNeeded - this.village.scientistCount;
    if (scientistShortage > 0) {
      this.village.produceScientist(scientistShortage); // 부족한 과학자 생산
    }

    // 행복도가 낮을 때 사제 생산
    if (this.village.happiness < 30) {
      const priestNeeded = Math.ceil(this.village.population * 0.05);
      const priestShortage = priestNeeded - this.village.priestCount;
      if (priestShortage > 0) {
        this.village.producePriest(priestShortage); // 부족한 사제 생산
      }
    }

    // 군인 생산 필요량 계산
    const soldierNeeded = Math.ceil(this.village.population * 0.2);
    const soldierShortage = soldierNeeded - this.village.soldierCount;
    if (soldierShortage > 0) {
      this.village.produceSoldier(soldierShortage); // 부족한 군인 생산
    }

    // 농부의 생산을 증가시킵니다.
    const farmerSurplus = Math.floor(
      (this.village.foodSupply - this.minFoodStorage) / 7
    );
    if (farmerSurplus > 0) {
      this.village.produceFarmer(farmerSurplus); // 농부 생산 증가
    }

    // // 인구 증가를 위해 최대한 많은 직업 생산
    // let maxJobToProduce = Math.min(
    //     Math.ceil(this.village.population * 0.5), // 인구의 반만큼의 과학자 생산
    //     Math.ceil(this.village.population * 0.05), // 인구의 5%만큼의 사제 생산
    //     Math.ceil(this.village.population * 0.6) // 인구의 60%만큼의 군인 생산
    // );

    // if (maxJobToProduce <= 0) return; // 생산할 직업이 없으면 종료

    // maxJobToProduce -= Math.min(maxJobToProduce, farmerSurplus || 0); // 농부가 생산한만큼 maxJobToProduce를 조정합니다.

    // if (maxJobToProduce > 0) {
    //     // 다른 직업 생산
    //     this.village.produceScientist(maxJobToProduce);
    //     this.village.producePriest(maxJobToProduce);
    //     this.village.produceSoldier(maxJobToProduce);
    // }
  }

  /**
   * 직업 생산을 중단하지 않고 농부만을 생산하는 메서드
   * 지난 해 인구와 식량으로부터 농부 부족분을 계산하여 농부를 생산합니다.
   */
  stopJobProduction() {
    const farmerShortage = Math.ceil(
      (this.village.lastYearPopulation - this.village.foodSupply) / 10
    ); // 농부 부족분 계산
    if (farmerShortage > 0) {
      this.village.produceFarmer(farmerShortage); // 부족한 농부 생산
    }
    return farmerShortage; // farmerShortage 반환
  }
}

class AdvancedVillageAI extends VillageAI {
  constructor(village) {
    super(village);
  }

  /**
   * 고급 AI의 직업 생산 관리
   * 식량만 생산하고, 인구 x 4 만큼의 식량이 유지될 때까지 다른 직업을 생산하지 않음
   * 그 이후에는 식량 생산을 우선하면서 다른 직업을 적극적으로 생산함
   */
  manageJobProduction() {
    const minRequiredFood = this.village.population * 2; // 인구 x 2 만큼의 식량이 최소 저장되어야 함
    const criticalFoodLevel = this.village.population * 4; // 인구 x 4 만큼의 식량이 없으면 심각한 상황

    if (this.village.foodSupply < minRequiredFood) {
      // 인구 x 2 만큼의 식량이 부족한 경우
      this.focusOnFoodProduction();
    } else if (this.village.foodSupply < criticalFoodLevel) {
      // 인구 x 4 만큼의 식량이 부족한 경우
      this.stopJobProduction();
      this.focusOnFoodProduction();
    } else {
      // 인구 x 4 만큼의 식량이 있는 경우
      this.resumeJobProduction();
      this.manageStandardJobProduction();
    }
  }

  /**
   * 직업 생산을 중단하지 않고 농부만을 생산하는 메서드
   */
  stopJobProduction() {
    const farmerShortage = Math.ceil(
      (this.village.lastYearPopulation - this.village.foodSupply) / 10
    );
    if (farmerShortage > 0) {
      this.village.produceFarmer(farmerShortage);
    }
    return farmerShortage; // farmerShortage 반환
  }

  /**
   * 직업 생산을 재개하는 메서드
   */
  resumeJobProduction() {
    // 여기에 필요한 경우 직업 생산을 재개하는 로직 추가
  }

  /**
   * 식량 생산에만 집중하는 메서드
   */
  focusOnFoodProduction() {
    const farmersToProduce = Math.floor(this.village.foodSupply / 50);
    if (farmersToProduce > 0) {
      this.village.produceFarmer(farmersToProduce);
    }
  }

  /**
   * 표준 직업 생산 관리 함수
   */
  manageStandardJobProduction() {
    const farmerShortage = this.stopJobProduction(); // stopJobProduction() 메서드 호출하여 farmerShortage 변수에 할당

    const scientistNeeded = Math.ceil(this.village.population * 0.1);
    const scientistShortage = scientistNeeded - this.village.scientistCount;
    if (scientistShortage > 0) {
      this.village.produceScientist(scientistShortage);
    }

    if (this.village.happiness < 30) {
      const priestNeeded = Math.ceil(this.village.population * 0.05);
      const priestShortage = priestNeeded - this.village.priestCount;
      if (priestShortage > 0) {
        this.village.producePriest(priestShortage);
      }
    }

    const soldierNeeded = Math.ceil(this.village.population * 0.2);
    const soldierShortage = soldierNeeded - this.village.soldierCount;
    if (soldierShortage > 0) {
      this.village.produceSoldier(soldierShortage);
    }

    while (this.village.foodSupply > 0) {
      let maxJobToProduce = Math.min(
        Math.floor(this.village.foodSupply / 50),
        Math.ceil(this.village.population * 0.1),
        Math.ceil(this.village.population * 0.05),
        Math.ceil(this.village.population * 0.2)
      );

      if (maxJobToProduce <= 0) break;

      const farmersToProduce = Math.min(maxJobToProduce, farmerShortage);
      this.village.produceFarmer(farmersToProduce);
      maxJobToProduce -= farmersToProduce;

      if (maxJobToProduce > 0) {
        this.village.produceScientist(maxJobToProduce);
        this.village.producePriest(maxJobToProduce);
        this.village.produceSoldier(maxJobToProduce);
      }
    }
  }
}

module.exports = {
  VillageAI,
  StupidVillageAI,
  AdvancedVillageAI,
  TestVillageAI,
};
