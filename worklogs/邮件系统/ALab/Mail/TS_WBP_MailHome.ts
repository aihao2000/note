import * as UE from "ue";
import { GetGlobalWorld, GetLocalPlayer, LogInfo } from "../../Global/GlobalFunction";
import { BindButtonEvent } from "../../Global/UIManager";
import TS_Mail from "./TS_Mail";
import TS_MailSystem from "./TS_MailSystem";
import TS_WBP_MailItem from "./TS_WBP_MailItem";
class TS_WBP_MailHome {
    static WidgetClass = UE.Class.Load("/Game/R_Mail/UI/UMG/Mail/WBP_Mail_Home.WBP_Mail_Home_C");
    WidgetInstance: UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Home.WBP_Mail_Home_C;
    WBP_MailList: Array<TS_WBP_MailItem>;
    constructor() {
        this.WBP_MailList = new Array<TS_WBP_MailItem>();
    }
    readonly Open = (): void => {
        if (!this.WidgetInstance) {
            this.WidgetInstance = UE.WidgetBlueprintLibrary.Create(GetGlobalWorld(), TS_WBP_MailHome.WidgetClass, null) as UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Home.WBP_Mail_Home_C;
        }
        this.BindData();
        this.BindEvent();
        this.WidgetInstance.AddToViewport();
    };
    readonly Close = (): void => {
        this.WidgetInstance.SetVisibility(UE.ESlateVisibility.Hidden);
    };
    readonly BindData = (): void => {
        if (TS_MailSystem.IsEmpty()) {
            this.WidgetInstance.Empty_Panel.SetVisibility(UE.ESlateVisibility.Visible);
            this.WidgetInstance.MailText_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
            this.WidgetInstance.MailList.SetVisibility(UE.ESlateVisibility.Hidden);
        } else {
            this.WidgetInstance.MailText_Panel.SetVisibility(UE.ESlateVisibility.Visible);
            this.WidgetInstance.Empty_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
            this.WidgetInstance.MailList.ClearChildren();
            this.WBP_MailList.splice(0, this.WBP_MailList.length);
            for (let i = 0; i < TS_MailSystem.Mails.length; i++) {
                this.WBP_MailList.push(new TS_WBP_MailItem(TS_MailSystem.Mails[i]));
            }
            this.WBP_MailList.sort(function (a: TS_WBP_MailItem, b: TS_WBP_MailItem): number {
                if (!a.MailPtr.IsHaveRead()) {
                    if (!b.MailPtr.IsHaveRead()) {
                        return Date.parse(b.MailPtr.ReceiveDate.toString()) - Date.parse(a.MailPtr.ReceiveDate.toString());
                    } else {
                        return -1;
                    }
                } else {
                    if (!b.MailPtr.IsHaveRead()) {
                        return 1;
                    } else {
                        return Date.parse(b.MailPtr.ReceiveDate.toString()) - Date.parse(a.MailPtr.ReceiveDate.toString());
                    }
                }
            });
            for (let i = 0; i < this.WBP_MailList.length; i++) {
                this.WidgetInstance.MailList.AddChild(this.WBP_MailList[i].GetInstance());
            }
            this.WidgetInstance.Cur_Num_Txt.SetText(TS_MailSystem.Mails.length.toString());
            this.WidgetInstance.Max_Num_Txt.SetText(TS_MailSystem.Capacity.toString());
        }
    };
    readonly BindEvent = (): void => {
        this.WidgetInstance.ObtainAll_Button.OnClicked.Add(TS_MailSystem.ObtainAll);
        this.WidgetInstance.ClearMailExpired_Button.OnClicked.Add(TS_MailSystem.ClearMailHaveRead);
    };
}
export default new TS_WBP_MailHome();
