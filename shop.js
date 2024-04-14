const { itemName } = require("./static");
const fs = require("fs");

class Shop {
  constructor() {
    this.items = []; // 판매하는 아이템 목록
    this.generateInitialItems();
    this.generateItems(); // 아이템 생성 시작
    this.foodPrice = 1; // 식량 가격
    // this.updateFoodPrice(); // 초기 식량 가격 설정 및 업데이트 시작
    this.foodToMoney = 0.5; // 식량과 돈의 교환 비율
  }

  // 상점 싱글톤 객체 반환 메서드
  static getInstance() {
    if (!Shop.instance) {
      Shop.instance = new Shop(); // 인스턴스 생성
    }
    return Shop.instance;
  }

  // 상점에서 식량을 판매하는 메서드
  sellFood(amount, village) {
    let totalPrice = amount * this.foodToMoney; // 총 가격 계산

    if (totalPrice < 1) {
      console.log("금액이 너무 적어 판매하지 않았습니다.");
      return;
    }

    totalPrice = Math.ceil(totalPrice); // 소수를 반올림하여 실수로 변환

    village.foodSupply -= amount; // 마을 식량 공급량에서 판매량 차감
    village.money += totalPrice; // 마을 자금에 판매 가격 추가

    console.log("│─────────────────────────────────────│");
    console.log(
      `│상점에 (${village.name}마을) 이 ${amount} 만큼의 식량을 판매하였고. `
    );
    console.log("│                                     │");
    console.log(`│${totalPrice} 만큼의 금액을 획득하였습니다.`);
    console.log("│─────────────────────────────────────│");
    this.printAsciiArtFromFile("./ASCII/coin.txt");
    // console.log(`${village.name} 마을이 ${amount} 만큼의 식량을 판매하였습니다.`);
    // console.log(`${village.name} 마을이 ${totalPrice} 만큼의 금액을 획득하였습니다.`);
    return totalPrice;
  }

  //   // 상점에서 식량 가격을 업데이트하는 메서드
  //   updateFoodPrice() {
  //     setInterval(() => {
  //       // 600:1 비율을 기준으로 식량 가격을 계산하되, 약간의 랜덤성 추가
  //       const basePrice = Math.ceil(
  //         Math.random() * (this.maxFoodPrice - this.minFoodPrice) +
  //           this.minFoodPrice
  //       );
  //       const randomMultiplier = Math.random() * 0.2 + 0.9; // 0.9부터 1.1 사이의 랜덤한 배율
  //       this.foodPrice = Math.ceil(basePrice * randomMultiplier); // 랜덤성을 반영한 최종 식량 가격 계산
  //       console.log(`식량 가격이 업데이트 되었습니다: ${this.foodPrice}`);
  //     }, 60000); // 60초마다 식량 가격 업데이트
  //   }

  // 초기 아이템 생성
  generateInitialItems() {
    for (let i = 0; i < 10; i++) {
      const randomItem = this.createRandomItem();
      // 아이템 생성 시 향상 정도도 설정
      randomItem.improvementPercentage = Math.floor(Math.random() * 100) + 1; // 향상 정도 랜덤 값 (1부터 50까지)
      randomItem.id = i + 1; // 아이템에 고유의 번호 부여
      this.addItem(randomItem);
    }
  }

  // 랜덤한 시간 간격으로 아이템 생성
  generateItems() {
    setInterval(() => {
      const randomItem = this.createRandomItem();
      randomItem.id = this.items.length + 1; // 새로 생성되는 아이템에 고유의 번호 부여
      this.addItem(randomItem);
      console.log("│─────────────────────────────────────│");
      console.log("│                                     │");
      console.log(
        `│ 상점에 새로운 아이템이 생성되었습니다: (${randomItem.name})`
      );
      console.log("│                                     │");
      console.log("│─────────────────────────────────────│");
      this.printAsciiArtFromFile("./ASCII/item.txt");
      //   console.log(`새로운 아이템이 생성되었습니다: ${randomItem.name}`);
    }, 15000); // 15초마다 새로운 아이템 생성
  }

  // 상점에서 모든 아이템을 반환하는 메서드
  getItems() {
    return this.items;
  }

  // 아이템 추가
  addItem(item) {
    this.items.push(item);
  }

  // 상점의 모든 물건들을 출력하는 메서드
  listItems() {
    if (this.items.length === 0) {
      console.log("물건이 없습니다.");
    } else {
      console.log("│─────────────────────────────────────│");
      console.log("│                                     │");
      console.log(`│          상점의 물건 목록             `);
      console.log("│                                     │");
      console.log("│─────────────────────────────────────│");
      this.printAsciiArtFromFile("./ASCII/shop.txt");
      this.items.forEach((item, index) => {
        let improvement = item.improvementPercentage; // 향상 정도 변수 초기화
        if (item.isPercentIncrease) {
          // 퍼센트로 증가하는 아이템인 경우
          improvement += "%"; // 퍼센트 기호 추가
        }
        console.log(
          `${item.id}. ${item.name} - 가격: ${
            item.price
          }, 효과: ${this.getEffectDescription(
            item.effect
          )}, 향상 정도: ${improvement}`
        );
      });
    }
  }

  // 아이템 효과에 대한 설명을 반환하는 메서드
  getEffectDescription(effect) {
    switch (effect) {
      case "increaseFood":
        return "식량 증가";
      case "increaseSoldier":
        return "군사력 증가";
      case "increaseScience":
        return "과학 증가";
      case "increaseTerritory":
        return "영토 증가";
      default:
        return "알 수 없음";
    }
  }

  // 아이템 구매
  buyItem(itemId, village) {
    // id에 해당하는 아이템 찾기
    const itemToRemove = this.items.find((item) => item.id === itemId);

    if (!itemToRemove) {
    //   console.log("해당 아이템이 존재하지 않습니다.");
      return;
    }

    const item = itemToRemove;

    if (village.money < item.price) {
    //   console.log("돈이 부족하여 해당 아이템을 구매할 수 없습니다.");
      return;
    }

    village.money -= item.price; // 아이템 가격만큼 돈 차감

    // 마을에 아이템의 효과 적용
    item.applyEffect(village);

    // 구매한 아이템 제거
    this.items = this.items.filter((i) => i.id !== itemId);

    // console.log("구매 후 남은 아이템 목록:", this.items);
  }

  // 랜덤한 아이템 생성
  createRandomItem() {
    const name = itemName[Math.floor(Math.random() * itemName.length)]; // 랜덤하게 아이템 이름 선택
    const effects = [
      "increaseFood",
      "increaseSoldier",
      "increaseScience",
      "increaseTerritory",
    ];
    const effect = effects[Math.floor(Math.random() * effects.length)]; // 랜덤하게 아이템 효과 선택
    const performance = Math.floor(Math.random() * 100) + 1; // 성능 랜덤 값 (1부터 10까지)
    const isPercentIncrease = Math.random() < 0.2; // 20% 확률로 퍼센트로 증가하는 아이템 생성
    const price = this.calculatePrice(effect, performance, isPercentIncrease); // 가격 계산
    return new Item(name, price, effect, performance, isPercentIncrease);
  }

  // 아이템 가격 계산
  calculatePrice(effect, performance, isPercentIncrease) {
    let basePrice = 50; // 기본 가격
    switch (effect) {
      case "increaseFood":
        if (isPercentIncrease) {
          basePrice += performance * 10000; // 퍼센트로 증가하는 아이템은 가격을 높게 설정
        } else {
          basePrice += performance * 2000; // 실수로 증가하는 아이템은 가격을 낮게 설정
        }
        break;
      case "increaseSoldier":
        if (isPercentIncrease) {
          basePrice += performance * 20000; // 퍼센트로 증가하는 아이템은 가격을 높게 설정
        } else {
          basePrice += performance * 4000; // 실수로 증가하는 아이템은 가격을 낮게 설정
        }
        break;
      case "increaseScience":
        if (isPercentIncrease) {
          basePrice += performance * 15000; // 퍼센트로 증가하는 아이템은 가격을 높게 설정
        } else {
          basePrice += performance * 3000; // 실수로 증가하는 아이템은 가격을 낮게 설정
        }
        break;
      case "increaseTerritory":
        if (isPercentIncrease) {
          basePrice += performance * 30000; // 퍼센트로 증가하는 아이템은 가격을 높게 설정
        } else {
          basePrice += performance * 6000; // 실수로 증가하는 아이템은 가격을 낮게 설정
        }
        break;
      default:
        break;
    }
    return basePrice;
  }

  // 파일을 읽어서 콘솔에 출력하는 함수 (클래스 메서드로 변경)
  async printAsciiArtFromFile(filePath) {
    try {
      const data = await fs.promises.readFile(filePath, "utf8");
      console.log(data);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }
}

class Item {
  constructor(name, price, effect, improvementPercentage, isPercentIncrease) {
    this.id = null; // 아이템의 고유 번호
    this.name = name; // 아이템 이름
    this.price = price; // 아이템 가격
    this.effect = effect; // 아이템이 마을에 주는 효과
    this.improvementPercentage = improvementPercentage; // 아이템 효과 향상 정도 (백분율)
    this.isPercentIncrease = isPercentIncrease; // 아이템 증가 방식 (true: 퍼센트로 증가, false: 실수로 증가)
  }

  // 아이템 효과 적용
  applyEffect(village) {
    // 아이템에 따라 마을에 특정 효과 적용
    if (this.effect === "increaseFood") {
      if (this.isPercentIncrease) {
        // 퍼센트로 증가하는 아이템일 경우
        village.foodSupply += Math.floor(
          Math.random() * 20 * (1 + this.improvementPercentage / 100)
        ); // 아이템 향상 정도에 따라 퍼센트로 증가
      } else {
        // 실수로 증가하는 아이템일 경우
        village.foodSupply += Math.floor(Math.random() * 20); // 랜덤 값으로 증가
      }
    } else if (this.effect === "increaseSoldier") {
      if (this.isPercentIncrease) {
        village.soldierCount += Math.floor(
          Math.random() * 5 * (1 + this.improvementPercentage / 100)
        ); // 아이템 향상 정도에 따라 퍼센트로 증가
      } else {
        village.soldierCount += Math.floor(Math.random() * 5); // 랜덤 값으로 증가
      }
    } else if (this.effect === "increaseScience") {
      if (this.isPercentIncrease) {
        village.science += Math.floor(
          Math.random() * 10 * (1 + this.improvementPercentage / 100)
        ); // 아이템 향상 정도에 따라 퍼센트로 증가
      } else {
        village.science += Math.floor(Math.random() * 10); // 랜덤 값으로 증가
      }
    } else if (this.effect === "increaseTerritory") {
      if (this.isPercentIncrease) {
        village.territorySize += Math.floor(
          Math.random() * 50 * (1 + this.improvementPercentage / 100)
        ); // 아이템 향상 정도에 따라 퍼센트로 증가
      } else {
        village.territorySize += Math.floor(Math.random() * 50); // 랜덤 값으로 증가
      }
    }
  }
}

module.exports = { Shop };
