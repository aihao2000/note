import { TSizedDefaultAllocator, Widget } from "ue";
import { UE } from "../../Global/Common";
import { GetGlobalWorld, LogInfo } from "../../Global/GlobalFunction";
import TS_Good from "./TS_Good";
import TS_Mail from "./TS_Mail";

class TS_WBP_Common_ItemIcon {
    static WidgetClass = UE.Class.Load("/Game/R_Mail/UI/UMG/Common/Item/WBP_Common_ItemIcon.WBP_Common_ItemIcon_C");
    WidgetInstance: UE.Game.R_Mail.UI.UMG.Common.Item.WBP_Common_ItemIcon.WBP_Common_ItemIcon_C;
    AttachmentPtr: { Good: TS_Good; bHaveObtained: boolean };
    constructor(Attachment: { Good: TS_Good; bHaveObtained: boolean }) {
        this.AttachmentPtr = Attachment;
        this.WidgetInstance = UE.WidgetBlueprintLibrary.Create(
            GetGlobalWorld(),
            TS_WBP_Common_ItemIcon.WidgetClass,
            null
        ) as UE.Game.R_Mail.UI.UMG.Common.Item.WBP_Common_ItemIcon.WBP_Common_ItemIcon_C;
        this.BindData();
        //   this.WidgetInstance.AddToViewport();
    }
    readonly GetInstance = (): UE.Game.R_Mail.UI.UMG.Common.Item.WBP_Common_ItemIcon.WBP_Common_ItemIcon_C => {
        return this.WidgetInstance;
    };
    readonly BindData = (): void => {
        if (this.AttachmentPtr.bHaveObtained) {
            this.WidgetInstance.Get_Panel.SetVisibility(UE.ESlateVisibility.Visible);
        } else {
            this.WidgetInstance.Get_Panel.SetVisibility(UE.ESlateVisibility.Hidden);
        }
    };
}
export default TS_WBP_Common_ItemIcon;
