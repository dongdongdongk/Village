const VillageManager = require('./VillageManager');

const villageManager = new VillageManager();
const Village = require('./village');
villageManager.startGame();

// Village 클래스의 생성자에서 villageManager 객체 전달
const initialVillage = new Village(villageManager);

// 사용자 입력 처리를 위해 handleUserInput 메서드를 호출합니다.
villageManager.handleUserInput();