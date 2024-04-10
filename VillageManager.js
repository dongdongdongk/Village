// VillageManager.js

const Village = require("./village");
const { names } = require("./static");
const readline = require("readline");
const fs = require("fs");

class VillageManager {
  constructor() {
    this.villages = [];
    this.year = 0;
    this.gameInterval = null;
    this.currentVillageNumber = 0; // 현재 마을 번호를 설정.

    // 사용자 입력을 받기 위한 readline 인터페이스 생성
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // 새로운 마을 이름 생성 메서드
  generateUniqueName() {
    let name;
    do {
      const randomIndex = Math.floor(Math.random() * names.length);
      name = names[randomIndex];
    } while (this.villages.some((village) => village.name === name));
    return name;
  }
  // 새로운 마을 번호 부여 처음 값 0 이후 1씩 증가
  getNextVillageNumber() {
    return this.currentVillageNumber++;
  }

  // 게임 시작 메서드
  startGame() {
    // 초기 마을 생성
    console.log("초기 마을 생성 중...");
    console.log("게임시작!!");
    console.log(` ______  __ __    ___      __ __  ____  _      _       ____   ____    ___ 
|      ||  |  |  /  _]    |  |  ||    || |    | |     /    | /    |  /  _]
|      ||  |  | /  [_     |  |  | |  | | |    | |    |  o  ||   __| /  [_ 
|_|  |_||  _  ||    _]    |  |  | |  | | |___ | |___ |     ||  |  ||    _]
  |  |  |  |  ||   [_     |  :  | |  | |     ||     ||  _  ||  |_ ||   [_ 
  |  |  |  |  ||     |      \   /  |  | |     ||     ||  |  ||     ||     |
  |__|  |__|__||_____|       \_/  |____||_____||_____||__|__||___,_||_____|`);

    console.log(
      " __  __   ____   __  __  ____    _____ __  __    ____  ____  __  _  ____  _   _ __  __ __ __  __  _  __  __  _  __  __ "
    );
    console.log(
      "|  \\/  | / () \\ |  |/  /| ===|   | () )\\ \\/ /   | _) \\/ () \\|  \\| |/ (_,`| |_| |\\ \\/ /|  |  ||  \\| ||  |/  /| ||  \\/  |"
    );
    console.log(
      "|_|\\/|_|/__/ __\\|__|\\__\\|____|    _()_) |__|    |____/\\____/|_|\\__|\\____)|_| |_| |__|  \\___/ |_|\\__||__|\\__\\|_||_|\\/|_|"
    );

    this.printAsciiArtFromFile("main.txt");

    const initialVillage = new Village(this);
    const villageNumber = this.getNextVillageNumber(); // 새로운 마을 번호를 받아옵니다.
    initialVillage.setVillageNumber(villageNumber); // Village에 마을 번호를 설정합니다.
    initialVillage.name = this.generateUniqueName(); // 새로운 마을 이름 할당
    this.villages.push(initialVillage);
    // console.log("\n초기 마을이 생성되었습니다!");
    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log("│─────────────────────────────────────│");
    console.log("│                                     │");
    console.log(`│초기 마을이 생성되었습니다!! (${initialVillage.name} 마을) `);
    console.log("│                                     │");
    console.log("│─────────────────────────────────────│");
    

    // 게임 루프 시작
    this.gameInterval = setInterval(() => {
      this.year++;
      // console.log(`\n\n===== ${this.year}년 =====`);
      this.checkDestroy();
      // 인구가 0인 마을 제거
      this.removeDeadVillages();

      // 랜덤하게 새로운 마을 생성
      if (Math.random() < 0.02) {
        const newVillage = new Village(this);
        const villageNumber = this.getNextVillageNumber(); // 새로운 마을 번호를 받아옵니다.
        newVillage.setVillageNumber(villageNumber); // Village에 마을 번호를 설정합니다.
        newVillage.name = this.generateUniqueName(); // 새로운 마을 이름 할당
        // console.log(`\n새로운 마을이 건설 되었습니다! ( ${newVillage.name} )`);
        console.log(" ")
        console.log(" ")
        console.log(" ")
        console.log("│─────────────────────────────────────│");
        console.log("│                                     │");
        console.log(`│새로운 마을이 건설 되었습니다! (${newVillage.name} 마을) `);
        console.log("│                                     │");
        console.log("│─────────────────────────────────────│");
        this.printAsciiArtFromFile("./ASCII/newVillage.txt");
        this.villages.push(newVillage);
      }
    }, 500);
  }

  // 현재 게임에서 관리되는 모든 마을의 배열을 반환하는 함수
  getAllVillages() {
    return this.villages;
  }

  //   // 전쟁을 시작하는 메서드
  //   initiateWar(attackerIndex, defenderIndex) {
  //     // 공격자와 수비자의 인덱스를 사용하여 마을 객체를 가져옵니다.
  //     const attacker = this.villages[attackerIndex];
  //     const defender = this.villages[defenderIndex];

  //     // 공격자와 수비자가 모두 유효한 마을 객체일 경우에만 전쟁을 시작합니다.
  //     if (attacker && defender) {
  //       const war = new War(attacker, defender); // 공격자와 수비자를 전달하여 전쟁 객체를 생성합니다.
  //       war.start(); // 전쟁을 시작합니다.
  //     } else {
  //       console.log("유효한 마을 번호를 입력하세요."); // 공격자 또는 수비자가 유효하지 않을 경우 에러 메시지를 출력합니다.
  //     }
  //   }

  // 인구가 0인 마을을 제거하는 메서드
  removeDeadVillages() {
    const deadVillages = this.villages.filter(
      (village) => village.population <= 0
    );
    deadVillages.forEach((village) => {
      this.removeVillage(village);
    });
  }

  // 멸망을 체크하는 메서드
  checkDestroy() {
    this.villages = this.villages.filter((village) => {
      if (village.destroy) {
        // 멸망한 마을 객체를 제거합니다.
        village = null; // 객체 참조를 제거합니다.
        return false;
      }
      return true;
    });
  }

  // 마을 객체 완전 삭제
  removeVillage(village) {
    const index = this.villages.indexOf(village);
    if (index !== -1) {
      this.villages.splice(index, 1);
    }
    // 객체 자체를 null로 설정
    village = null;
  }

  // 모든 마을의 정보를 업데이트하고 출력하는 메서드
  updateAllVillagesInfo() {
    this.villages.forEach((village, index) => {
      console.log(`\n마을 ${index + 1} 정보:`);
      village.updatePopulation();
      console.log(`인구: ${village.population}명`);
      console.log(`영토: ${village.territorySize}`);
      console.log(`군인 수: ${village.soldierCount}`);
      console.log(`식량 : ${village.foodSupply}`);
    });

    // 인구가 0인 마을 제거
    this.removeDeadVillages();
  }

  // 모든 마을의 간략한 정보를 출력하는 메서드
  showAllVillagesInfo() {
    console.log("===== 모든 마을 정보 =====");
    this.printAsciiArtFromFile("ascii.txt");
    console.log(`===== 현재 년도 : ${this.year}년 =====`);
    this.villages.forEach((village, index) => {
      console.log("┌─────────────────────────────────────┐");
      console.log(
        `│ ${village.name}마을, 번호:${village.villageNumber}, 인구 ${village.population}명, 영토 ${village.territorySize}, 군인 수 ${village.soldierCount} │`
      );
      console.log("└─────────────────────────────────────┘");
    });
  }

  // 특정 마을의 상세 정보를 출력하는 메서드
  showVillageDetails(villageNumber) {
    // villageNumber를 입력으로 받아 마을을 찾습니다.
    const village = this.villages.find(
      (village) => village.villageNumber === villageNumber
    );

    if (village) {
      console.log(`\n마을 ${villageNumber} 상세 정보:`);
      village.printPrimitiveAndAncientEraImage();
      village.printVillageInfo(); // Village의 printVillageInfo 메서드 호출
      village.printFoodReport();
      if (village.population <= 0) {
        console.log(`마을 ${villageNumber}은(는) 이미 멸망하였습니다.`);
      }
    } else {
      console.log("해당 마을 번호에 해당하는 마을이 없습니다.");
    }
  }

  // 사용자 입력을 받고 처리하는 메서드
  async handleUserInput() {
    for await (const line of this.rl) {
      if (line === "마을 전체") {
        this.showAllVillagesInfo();
      } else if (line.startsWith("마을 상세")) {
        const villageNumber = parseInt(line.split(" ")[2]); // "마을 상세" 다음의 숫자를 정수로 변환하여 가져옴
        this.showVillageDetails(villageNumber); // showVillageDetails 메서드 호출
      } else {
        console.log("알 수 없는 명령입니다.");
      }
    }
  }

  // 게임 루프를 중지하는 메서드
  stopGame() {
    clearInterval(this.gameInterval);
    this.rl.close(); // readline 인터페이스 종료
  }

  // 파일을 읽어서 콘솔에 출력하는 함수 (클래스 메서드로 변경)
  printAsciiArtFromFile(filePath) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("파일을 읽는 도중 오류가 발생했습니다:", err);
        return;
      }
      console.log(data);
    });
  }
}

module.exports = VillageManager;
