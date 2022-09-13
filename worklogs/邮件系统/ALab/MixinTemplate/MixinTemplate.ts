import { blueprint } from "puerts";
import * as UE from "ue";
import { PrintToScreen } from "../../Global/GlobalFunction";
import { ALog } from "../ALabFunctionLibrary";
interface Mixinclass extends UE.Game.ALab.TestMixin.MixinBase.MixinBase_C {}
class Mixinclass {
    ReceiveBeginPlay(): void {
        PrintToScreen("BeginPlay Mixin");
    }
}
class MixinTemplate {
    classBaseBP: any;
    classBaseJS: any;
    classDerivedByMixin: any;
    constructor() {}
    Mixin(path_BP: string): void {
        this.classBaseBP = UE.Class.Load(path_BP);
        this.classBaseJS = blueprint.tojs<typeof UE.Game.ALab.TestMixin.MixinBase.MixinBase_C>(this.classBaseBP);
        this.classDerivedByMixin = blueprint.mixin(this.classBaseJS, Mixinclass);
    }
    GetDerivedStaticClass(): UE.Class {
        if (!this.classDerivedByMixin) {
            ALog("Have not Mixin");
        }
        return this.classDerivedByMixin.StaticClass();
    }
}
export default new MixinTemplate();
