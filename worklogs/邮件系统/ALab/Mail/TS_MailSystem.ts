import { MaterialInstanceConstant } from "ue";
import { ConfMailList } from "../../Config/ConfMailList";
import { UE } from "../../Global/Common";
import { GetGlobalWorld, LogInfo } from "../../Global/GlobalFunction";
import ConfigTool from "../../Util/ConfigTool";
import TS_Good from "./TS_Good";
import TS_Mail from "./TS_Mail";
import TS_WBP_MailHome from "./TS_WBP_MailHome";

class TS_MailSystem {
    Capacity: number;
    Mails: Array<TS_Mail>;
    constructor(Capacity: number) {
        this.Capacity = 100;
        if (Capacity != undefined) {
            this.Capacity = Capacity;
        }
    }
    Init(): void {
        this.Mails = new Array<TS_Mail>();
        // for (let i = 1; i <= 10; i++) {
        //     this.Mails.push(new TS_Mail("title" + i.toString(), "head" + i.toString(), "Content" + i.toString(), "Inscribe" + i.toString(), new Date(), [new TS_Good(), new TS_Good(), new TS_Good()]));
        // }
        // for (let i = 11; i <= 20; i++) {
        //     this.Mails.push(new TS_Mail("title" + i.toString(), "head" + i.toString(), "Content" + i.toString(), "Inscribe" + i.toString(), new Date(), null));
        // }
        for (let i = 1; i <= 20; i++) {
            let data = ConfigTool.Get(ConfMailList, i);
            if (data == null) {
                continue;
            }
            this.Mails.push(new TS_Mail(data.Title, data.Head, data.Content, data.Inscribe, undefined, data.Attachments, data.Lifespan));
        }
    }
    ReceiveMail(Mail: TS_Mail): void {
        if (this.Mails.length == this.Capacity) {
            for (let i = 0; i < this.Mails.length; i++) {
                if (this.Mails[i].IsHaveObtained() && this.Mails[i].IsHaveRead()) {
                    this.Mails.splice(i, 1);
                    this.Mails.push(Mail);
                    return;
                }
            }
            this.Mails[0].Obtain();
            this.Mails.shift();
            this.Mails.push(Mail);
        } else {
            this.Mails.push(Mail);
        }
        TS_WBP_MailHome.BindData();
    }
    readonly ObtainAll = (): boolean => {
        LogInfo("Mail:MailSystem.ObtainAll");
        let res = true;
        for (let i = 0; i < this.Mails.length; i++) {
            res = res && this.Mails[i].Obtain();
        }
        TS_WBP_MailHome.BindData();
        return res;
    };
    // IsLeapYear(year: number) {
    //     if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    //         return true;
    //     }
    //     return false;
    // }
    // DateToHours(date: Date): number {
    //     let hours: number = 0;
    //     for (let i = 0; i < date.getFullYear(); i++) {
    //         hours += (this.IsLeapYear(i) ? 366 : 365)*24;
    //     }
    //     let daysOfMouth:[undefined,31,28,31,30,31,30,31,31,30,31,30,31];
    //     if(this.IsLeapYear(date.getFullYear()))
    //     {
    //         daysOfMouth[2]=29;
    //     }
    //     else
    //     {
    //         daysOfMouth[2]=28;
    //     }
    //     for(let i=1;i<date.getMonth();i++)
    //     {
    //         hours+=this.
    //     }
    //     return hours;
    // }
    readonly ClearMailExpired = (): void => {
        let CurrentDate = new Date();
        for (let i = this.Mails.length; i >= 0; i--) {
            let DeltaDays: number = (Date.parse(CurrentDate.toString()) - Date.parse(this.Mails[i].toString())) / 1000 / 60 / 60 / 24;
            if (DeltaDays > this.Mails[i].Lifespan - 1) {
                this.Mails[i].Obtain();
                this.Mails.splice(i, 1);
            }
        }
        TS_WBP_MailHome.BindData();
    }; //0点时调用
    readonly ClearMailHaveRead = (): void => {
        LogInfo("Mail:MailSystem.ClearMailHaveRead");
        for (let i = this.Mails.length - 1; i >= 0; i--) {
            if (this.Mails[i].IsHaveAttachments()) {
                if (this.Mails[i].IsHaveObtained()) {
                    this.Mails.splice(i, 1);
                }
            } else {
                if (this.Mails[i].IsHaveRead()) {
                    this.Mails.splice(i, 1);
                }
            }
        }
        TS_WBP_MailHome.BindData();
    };
    IsEmpty(): boolean {
        return this.Mails.length == 0;
    }
}
export default new TS_MailSystem();
