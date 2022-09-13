import { blueprint } from "puerts";
import * as UE from "ue";
import { PrintToScreen } from "../../Global/GlobalFunction";
import { ALog } from "../ALabFunctionLibrary";
interface MixinTemp extends UE.Game.ALab.TestMixin.MixinBase.MixinBase_C {}
class MixinTemp {}
class MixinClass extends MixinTemp {
    ReceiveBeginPlay(): void {
        // super.ReceiveBeginPlay();
        PrintToScreen("BeginPlay Mixin");
    }
}
class MixinSuperTemplate {
    //classBaseBP classBaseJS需要保持生命周期同步
    classBaseBP: any;
    classBaseJS: any;
    classDerivedByMixin: any;
    constructor() {}
    Mixin(path_BP: string): void {
        this.classBaseBP = UE.Class.Load(path_BP);
        this.classBaseJS = blueprint.tojs<typeof UE.Game.ALab.TestMixin.MixinBase.MixinBase_C>(this.classBaseBP);
        Object.setPrototypeOf(MixinTemp.prototype, this.classBaseJS.prototype);
        this.classDerivedByMixin = blueprint.mixin(this.classBaseJS, MixinClass);
    }
    GetDerivedStaticClass(): UE.Class {
        if (!this.classDerivedByMixin) {
            ALog("Haven't Mixin");
        }
        return this.classDerivedByMixin.StaticClass();
    }
}
export default new MixinSuperTemplate();
