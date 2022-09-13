import * as UE from "ue";
import { int64 } from "../../NetWork/pbFile/def";

class TS_CharacterInfoWidget extends UE.UserWidget {
    name: string;
    weaponName: string;
    weaponLevel: string;
    worldLevel: string;
    protagonistExp: string;
    fightAss: string;
    Constructor() {
        this.name = "name";
        this.weaponName = "weaponName";
        this.worldLevel = "25";
        this.worldLevel = "8";
        this.protagonistExp = "66666/9999999";
        this.fightAss = "999999";
    }
}
export default TS_CharacterInfoWidget;
