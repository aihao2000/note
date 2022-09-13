import { Widget } from "ue";
import { UE } from "../../Global/Common";
import { GetGlobalWorld, LogInfo } from "../../Global/GlobalFunction";
import TS_Mail from "./TS_Mail";
import TS_WBP_MailHome from "./TS_WBP_MailHome";
import TS_WBP_MailLetter from "./TS_WBP_MailLetter";

class TS_WBP_MailItem {
    static WidgetClass = UE.Class.Load("/Game/R_Mail/UI/UMG/Mail/WBP_Mail_Item_Entry.WBP_Mail_Item_Entry_C");
    MailPtr: TS_Mail;
    private _WidgetInstance: UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Item_Entry.WBP_Mail_Item_Entry_C;
    public get WidgetInstance(): UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Item_Entry.WBP_Mail_Item_Entry_C {
        return this._WidgetInstance;
    }
    public set WidgetInstance(value: UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Item_Entry.WBP_Mail_Item_Entry_C) {
        this._WidgetInstance = value;
    }
    WBP_MailLetter: TS_WBP_MailLetter;
    constructor(Mail: TS_Mail) {
        this.MailPtr = Mail;
        Mail.WBP_MailItemPtr = this;
        this.WidgetInstance = UE.WidgetBlueprintLibrary.Create(GetGlobalWorld(), TS_WBP_MailItem.WidgetClass, null) as UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Item_Entry.WBP_Mail_Item_Entry_C;
        this.BindData();
        this.BindEvent();
        this.WidgetInstance.AddToViewport();
    }
    readonly OpenLetter = () => {
        if (this.WBP_MailLetter == null) this.WBP_MailLetter = new TS_WBP_MailLetter(this.MailPtr);
        this.WBP_MailLetter.Open();
        TS_WBP_MailHome.BindData();
    };
    readonly GetInstance = (): UE.Game.R_Mail.UI.UMG.Mail.WBP_Mail_Item_Entry.WBP_Mail_Item_Entry_C => {
        return this.WidgetInstance;
    };
    readonly BindData = (): void => {
        this.WidgetInstance.Title_Content_Txt.SetText(this.MailPtr.Title);
        this.WidgetInstance.From_Txt.SetText(this.MailPtr.Inscribe);
        this.WidgetInstance.Send_Time_Txt.SetText(
            this.MailPtr.ReceiveDate.getFullYear().toString() + "-" + this.MailPtr.ReceiveDate.getMonth().toString() + "-" + this.MailPtr.ReceiveDate.getDay().toString()
        );
        let CurrentDays = Date.parse(new Date().toString()) / 1000 / 60 / 60 / 24;
        let DestoryDays = Date.parse(this.MailPtr.ReceiveDate.toString()) / 1000 / 60 / 60 / 24 + this.MailPtr.Lifespan;
        let DeltaDays = DestoryDays - CurrentDays;
        if (DestoryDays - CurrentDays >= 1) {
            this.WidgetInstance.Time_Remaining_Txt.SetText(Math.floor(DeltaDays).toString());
            this.WidgetInstance.Time_Unit_Txt.SetText("天");
        } else {
            let CurrentHours = Date.parse(new Date().toString()) / 1000 / 60 / 60;
            let DestoryHours = Date.parse(this.MailPtr.ReceiveDate.toString()) / 1000 / 60 / 60 + this.MailPtr.Lifespan * 24;
            let DeltaHours = DestoryHours - CurrentHours;
            if (DeltaHours >= 1) {
                this.WidgetInstance.Time_Remaining_Txt.SetText(Math.floor(DeltaHours).toString());
                this.WidgetInstance.Time_Unit_Txt.SetText("时");
            } else {
                this.WidgetInstance.Time_Remaining_Txt.SetText("1");
                this.WidgetInstance.Time_Unit_Txt.SetText("小时内");
            }
        }
        if (this.MailPtr.IsHaveAttachments()) {
            this.WidgetInstance.Item_Img.SetVisibility(UE.ESlateVisibility.Visible);
            this.WidgetInstance.Default_Bg_Img.SetVisibility(UE.ESlateVisibility.Hidden);
            if (this.MailPtr.IsHaveObtained()) {
                this.WidgetInstance.Received_Overlay.SetVisibility(UE.ESlateVisibility.Visible);
                this.WidgetInstance.Readed_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
            } else {
                if (this.MailPtr.IsHaveRead()) {
                    this.WidgetInstance.Readed_Panel.SetVisibility(UE.ESlateVisibility.Visible);
                    this.WidgetInstance.Received_Overlay.SetVisibility(UE.ESlateVisibility.Hidden);
                } else {
                    this.WidgetInstance.Readed_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
                    this.WidgetInstance.Received_Overlay.SetVisibility(UE.ESlateVisibility.Hidden);
                }
            }
        } else {
            this.WidgetInstance.Default_Bg_Img.SetVisibility(UE.ESlateVisibility.Visible);
            this.WidgetInstance.Item_Img.SetVisibility(UE.ESlateVisibility.Hidden);
            if (this.MailPtr.IsHaveRead()) {
                this.WidgetInstance.Readed_Panel.SetVisibility(UE.ESlateVisibility.Visible);
                this.WidgetInstance.Received_Overlay.SetVisibility(UE.ESlateVisibility.Hidden);
            } else {
                this.WidgetInstance.Readed_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
                this.WidgetInstance.Received_Overlay.SetVisibility(UE.ESlateVisibility.Hidden);
            }
        }
    };
    readonly BindEvent = (): void => {
        this.WidgetInstance.Open_Button.OnClicked.Add(this.OpenLetter);
    };
}
export default TS_WBP_MailItem;
