import { MovieSceneComponentAttachmentSystem, Widget } from "ue";
import { UE } from "../../Global/Common";
import { TS_Good } from "./TS_Good";
import TS_WBP_MailItem from "./TS_WBP_MailItem";
import TS_WBP_MailLetter from "./TS_WBP_MailLetter";
class TS_Mail {
    Id: number;
    Title: string;
    Head: string;
    Content: string;
    Inscribe: string;
    ReceiveDate: Date;
    bHaveRead: boolean;
    Attachments: Array<{ Good: TS_Good; bHaveObtained: boolean }>;
    Lifespan: number; //单位：天
    WBP_MailItemPtr: TS_WBP_MailItem;
    WBP_MailLetterPtr: TS_WBP_MailLetter;
    constructor(Title: string, Head: string, Content: string, Inscribe: string, ReceiveDate: Date, Attachments: Array<TS_Good> = null, Lifespan = undefined) {
        this.Title = Title;
        this.Head = Head;
        this.Content = Content;
        this.Inscribe = Inscribe;
        if (ReceiveDate != undefined) this.ReceiveDate = ReceiveDate;
        else this.ReceiveDate = new Date();
        this.bHaveRead = false;
        this.Attachments = new Array<{ Good: TS_Good; bHaveObtained }>();
        this.WBP_MailItemPtr = null;
        this.WBP_MailLetterPtr = null;
        if (Attachments != null) {
            for (let i = 0; i < Attachments.length; i++) {
                this.Attachments.push({ Good: Attachments[i], bHaveObtained: false });
            }
        }
        if (Lifespan == undefined) {
            if (Attachments != null) {
                this.Lifespan = 15;
            } else {
                this.Lifespan = 7;
            }
        } else {
            this.Lifespan = Lifespan;
        }
    }
    readonly Obtain = (): boolean => {
        for (let i = 0; i < this.Attachments.length; i++) {
            if (!this.Attachments[i].bHaveObtained) {
                this.Attachments[i].bHaveObtained = this.Attachments[i].Good.Obtain();
            }
        }
        for (let i = 0; i < this.Attachments.length; i++) {
            if (!this.Attachments[i].bHaveObtained) {
                return false;
            }
        }
        if (this.WBP_MailItemPtr != null) {
            this.WBP_MailItemPtr.BindData();
        }
        if (this.WBP_MailLetterPtr != null) {
            this.WBP_MailLetterPtr.BindData();
        }
        return true;
    };
    readonly IsHaveObtained = (): boolean => {
        for (let i = 0; i < this.Attachments.length; i++) {
            if (!this.Attachments[i].bHaveObtained) return false;
        }
        return true;
    };
    readonly IsHaveRead = (): boolean => {
        return this.bHaveRead;
    };
    readonly IsHaveAttachments = (): boolean => {
        return this.Attachments.length != 0;
    };
}
export default TS_Mail;
