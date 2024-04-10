const fs = require("fs");

class War {
  constructor(attacker, defender) {
    this.attacker = attacker;
    this.defender = defender;
    this.maxAbsorbedTerritory = 0; // 약탈한 영토 크기를 저장할 변수
  }

  start() {
    // console.log("┌─────────────────────────────────────┐");
    // console.log(
    //   `│ (${this.attacker.name}) 마을이 침략을 시도합니다. │`
    // );

    console.log("│─────────────────────────────────────│");
    console.log("│                                     │");
    console.log(`│ (${this.attacker.name}) 마을이 침략을 시도합니다..`);
    console.log("│                                     │");
    console.log("│─────────────────────────────────────│");
    this.printAsciiArtFromFile("./ASCII/warVillage.txt");

    console.log("├─────────────────────────────────────┤");
    console.log(`│ 공격 마을: ${this.attacker.name}`);
    console.log("│─────────────────────────────────────│");
    console.log(`│ 수비 마을: ${this.defender.name}`);
    console.log("│─────────────────────────────────────│");

    // 공격자와 수비자의 군사 수를 가져옵니다.
    const attackerSoldiers = this.attacker.soldierCount;
    const defenderSoldiers = this.defender.soldierCount;

    // 공격자와 수비자의 군사 수에 따른 승리 확률을 계산합니다.
    const attackerWinProbability =
      attackerSoldiers / (attackerSoldiers + defenderSoldiers);

    // 전투 결과를 랜덤으로 결정합니다.
    const randomValue = Math.random();
    const attackerWins = randomValue < attackerWinProbability;

    // 전투 결과에 따라 처리합니다.
    if (attackerWins) {
      // 공격 마을이 승리한 경우
      console.log(
        `│ ${this.attacker.name} 마을이 승리하였습니다!(침략 마을) │`
      );
      // 적 마을의 영토를 일부 흡수합니다.
      this.maxAbsorbedTerritory = Math.floor(
        this.defender.territorySize *
          (this.attacker.soldierCount /
            (this.attacker.soldierCount + this.defender.soldierCount))
      );
      const absorbedTerritory = Math.min(
        this.maxAbsorbedTerritory,
        this.defender.territorySize
      );
      this.attacker.territorySize += absorbedTerritory;
      this.defender.territorySize -= absorbedTerritory;
      this.attacker.expansionDesire = 0;
    } else {
      // 수비 마을이 승리한 경우
      console.log(
        `│ ${this.defender.name} 마을이 승리하였습니다!(방어 마을) │`
      );
      this.attacker.expansionDesire = 0;
      // 패배하여 군사 수가 감소하고, 영토는 그대로 남습니다.
      const lostSoldiers = Math.floor(this.attacker.soldierCount * 0.8); // 공격자의 군사 수를 80% 감소시킵니다.
      this.attacker.reduceSoldiers(lostSoldiers);
    }

    // 공격자와 수비자의 군사 수 및 약탈한 영토 크기를 출력합니다.
    // console.log(
    //   `│ 공격 마을 ${this.attacker.name} 군인 수: ${this.attacker.soldierCount}, 방어 마을 ${this.defender.name} 군인 수: ${this.defender.soldierCount}, 약탈한 영토 : ${this.maxAbsorbedTerritory} │`
    // );

    console.log("│─────────────────────────────────────│");
    console.log(
      `│ 공격 마을 ${this.attacker.name} : 군인 수: ${this.attacker.soldierCount}`
    );
    console.log("│─────────────────────────────────────│");
    console.log(
      `│ 방어 마을 ${this.defender.name} : 군인 수: ${this.defender.soldierCount}`
    );
    console.log("│─────────────────────────────────────│");
    console.log(`│ 약탈한 영토 : ${this.maxAbsorbedTerritory}`);
    console.log("│─────────────────────────────────────│");

    // 전투가 종료된 후, 수비 마을의 영토가 10 이하가 되면 멸망시킵니다.
    if (this.defender.territorySize <= 10) {
      this.defender.destroyVillage();
    }
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

module.exports = {
  War,
};
