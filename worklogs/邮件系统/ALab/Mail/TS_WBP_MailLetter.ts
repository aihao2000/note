import { isWhileStatement } from "typescript";
import { BlueprintInputDebugKeyDelegateBinding, Widget } from "ue";
import { UE } from "../../Global/Common";
import { GetGlobalWorld, LogError, LogInfo } from "../../Global/GlobalFunction";
import TS_Mail from "./TS_Mail";
import TS_WBP_Common_ItemIcon from "./TS_WBP_Common_ItemIcon";

class TS_WBP_MailLetter {
    static WidgetClass = UE.Class.Load("/Game/R_Mail/UI/UMG/Mail/WBP_Mail_Letter.WBP_Mail_Letter_C");
    WidgetInstance: UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Letter.WBP_Mail_Letter_C;
    WBP_Attachments: Array<TS_WBP_Common_ItemIcon>;
    MailPtr: TS_Mail;
    constructor(Mail: TS_Mail) {
        this.WidgetInstance = UE.WidgetBlueprintLibrary.Create(GetGlobalWorld(), TS_WBP_MailLetter.WidgetClass, null) as UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Letter.WBP_Mail_Letter_C;
        this.WBP_Attachments = new Array<TS_WBP_Common_ItemIcon>();
        this.MailPtr = Mail;
        Mail.WBP_MailLetterPtr = this;
        this.BindData();
        this.BindEvent();
    }
    readonly Open = (): void => {
        this.WidgetInstance.AddToViewport();
        this.MailPtr.bHaveRead = true;
    };
    readonly Close = (): void => {
        this.WidgetInstance.SetVisibility(UE.ESlateVisibility.Hidden);
    };
    readonly BindData = (): void => {
        this.WidgetInstance.Title_Txt.SetText(this.MailPtr.Title);
        this.WidgetInstance.Head_Txt.SetText(this.MailPtr.Head);
        this.WidgetInstance.Inscribe_Txt.SetText(this.MailPtr.Inscribe);
        this.WidgetInstance.Date_Txt.SetText(
            this.MailPtr.ReceiveDate.getFullYear().toString() + "-" + this.MailPtr.ReceiveDate.getMonth().toString() + "-" + this.MailPtr.ReceiveDate.getDay().toString()
        );
        if (this.MailPtr.IsHaveAttachments()) {
            this.WidgetInstance.Item_Panel.SetVisibility(UE.ESlateVisibility.Visible);
            this.WidgetInstance.Attachments.SetVisibility(UE.ESlateVisibility.Visible);
            this.WidgetInstance.Attachments.ClearChildren();
            this.WBP_Attachments.splice(0, this.WBP_Attachments.length);
            for (let i = 0; i < this.MailPtr.Attachments.length; i++) {
                this.WBP_Attachments.push(new TS_WBP_Common_ItemIcon({ Good: this.MailPtr.Attachments[i].Good, bHaveObtained: this.MailPtr.Attachments[i].bHaveObtained }));
            }
            for (let i = 0; i < this.WBP_Attachments.length; i++) {
                this.WidgetInstance.Attachments.AddChild(this.WBP_Attachments[i].GetInstance());
                this.WidgetInstance.Attachments.SetVisibility(UE.ESlateVisibility.Visible);
            }
            this.WidgetInstance.Geted_Panel.SetVisibility(UE.ESlateVisibility.Visible);
            if (this.MailPtr.IsHaveObtained()) {
                this.WidgetInstance.Skill_Type_Txt.SetText("已领取");
            } else {
                this.WidgetInstance.Skill_Type_Txt.SetText("领取");
            }
        } else {
            this.WidgetInstance.Item_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
            this.WidgetInstance.Geted_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
        }
    };
    readonly BindEvent = (): void => {
        this.WidgetInstance.Obtain_Button.OnClicked.Add(this.MailPtr.Obtain);
        this.WidgetInstance.Close_Button.OnClicked.Add(this.Close);
    };
}
export default TS_WBP_MailLetter;
