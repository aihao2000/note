import * as UE from "ue";
import { PrintToScreen, SpawnActorByClass } from "../../Global/GlobalFunction";
class TS_CharacterInfoModule extends UE.Actor {
    CharacterInfoLevelInstance: UE.Game.ALab.CharacterInfo.CharacterInfoLevel_LevelInstance.CharacterInfoLevel_LevelInstance_C;
    Constructor() {
        this.EnableInput(UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0));
    }
    OpenCharacterInfoUI(): void {
        this.CharacterInfoLevelInstance = SpawnActorByClass(
            this.GetWorld(),
            UE.Class.Load("/Game/ALab/CharacterInfo/CharacterInfoLevel_LevelInstance.CharacterInfoLevel_LevelInstance_C"),
            new UE.Vector(1000, 1000, 1000),
            new UE.Rotator(0, 0, 0)
        ) as UE.Game.ALab.CharacterInfo.CharacterInfoLevel_LevelInstance.CharacterInfoLevel_LevelInstance_C;
    }
    CloseCharacterInfoUI(): void {
        this.CharacterInfoLevelInstance.K2_DestroyActor();
    }
}
export default TS_CharacterInfoModule;
