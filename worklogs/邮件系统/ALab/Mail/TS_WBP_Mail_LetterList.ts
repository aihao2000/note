import { Widget } from "ue";
import { UE } from "../../Global/Common";
import { GetGlobalWorld } from "../../Global/GlobalFunction";
import TS_Mail from "./TS_Mail";

class TS_WBP_MailLetterList {
    static WidgetClass = UE.Class.Load("/Game/R_Mail/UI/UMG/Mail/WBP_Mail_LetterList_Entry.WBP_Mail_LetterList_Entry_C");
    WidgetInstance: UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_LetterList_Entry.WBP_Mail_LetterList_Entry_C;
    Content: string;
    constructor(str: string) {
        this.WidgetInstance = UE.WidgetBlueprintLibrary.Create(
            GetGlobalWorld(),
            TS_WBP_MailLetterList.WidgetClass,
            null
        ) as UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_LetterList_Entry.WBP_Mail_LetterList_Entry_C;
        this.WidgetInstance.AddToViewport();
    }
    readonly GetInstance = (): UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_LetterList_Entry.WBP_Mail_LetterList_Entry_C => {
        return this.WidgetInstance;
    };
    readonly BindData = (): void => {};
}
export default TS_WBP_MailLetterList;
