//import { Empty } from "google-protobuf/google/protobuf/empty_pb";
//import { Duration } from "google-protobuf/google/protobuf/duration_pb";

import { get as getToken, IUser, signIn } from "./reducers/current-user";
//import { DURATION } from "./reducers/current-user";
import { ISite, refresh as refreshLayout } from "./reducers/layout";
import { ISettingItem, refresh as refreshSetting } from "./reducers/setting";
import { refresh as refreshTheme } from "./reducers/theme";
import { get, IErrorResponse } from "./request";
import { get as getLang } from "./locales";

import store from "./store";
import { ITerm, push } from "./reducers/term-vocabulary";
import { push as nissayaEndingPush } from "./reducers/nissaya-ending-vocabulary";
import { IRelation, IRelationListResponse } from "./pages/admin/relation/list";
import { pushRelation } from "./reducers/relation";

export interface ISiteInfoResponse {
  title: string;
}
interface IUserData {
  id: string;
  nickName: string;
  realName: string;
  avatar: string;
  roles: string[];
  token: string;
}
export interface ITokenRefreshResponse {
  ok: boolean;
  message: string;
  data: IUserData;
}

interface ITermResponse {
  ok: boolean;
  message: string;
  data: {
    rows: ITerm[];
    count: number;
  };
}
interface INissayaEnding {
  ending: string;
}
interface INissayaEndingResponse {
  ok: boolean;
  message: string;
  data: {
    rows: INissayaEnding[];
    count: number;
  };
}
const init = () => {
  get<ISiteInfoResponse | IErrorResponse>("/v2/siteinfo/en").then(
    (response) => {
      if ("title" in response) {
        const it: ISite = {
          title: response.title,
          subhead: "",
          keywords: [],
          description: "",
          copyright: "",
          logo: "",
          author: { name: "", email: "" },
        };
        store.dispatch(refreshLayout(it));
      }
    }
  );
  const token = getToken();
  if (token) {
    get<ITokenRefreshResponse | IErrorResponse>("/v2/auth/current").then(
      (response) => {
        console.log(response);
        if ("data" in response) {
          const it: IUser = {
            id: response.data.id,
            nickName: response.data.nickName,
            realName: response.data.realName,
            avatar: response.data.avatar,
            roles: response.data.roles,
          };
          store.dispatch(signIn([it, response.data.token]));
        }
      }
    );
  } else {
    console.log("no token");
  }

  //获取用户设置
  const setting = localStorage.getItem("user-settings");
  if (setting !== null) {
    const json: ISettingItem[] = JSON.parse(setting);
    store.dispatch(refreshSetting(json));
  }
  //获取术语表
  get<ITermResponse>(`/v2/term-vocabulary?view=grammar&lang=` + getLang()).then(
    (json) => {
      if (json.ok) {
        store.dispatch(push(json.data.rows));
      }
    }
  );

  get<ITermResponse>(
    `/v2/term-vocabulary?view=community&lang=` + getLang()
  ).then((json) => {
    if (json.ok) {
      store.dispatch(push(json.data.rows));
    }
  });

  //获取nissaya ending 表
  get<INissayaEndingResponse>(`/v2/nissaya-ending-vocabulary?lang=my`).then(
    (json) => {
      if (json.ok) {
        const nissayaEnding = json.data.rows.map((item) => item.ending);
        store.dispatch(nissayaEndingPush(nissayaEnding));
      }
    }
  );

  //获取 relation 表
  get<IRelationListResponse>(`/v2/relation?vocabulary=true&limit=1000`).then(
    (json) => {
      if (json.ok) {
        const items: IRelation[] = json.data.rows.map((item, id) => {
          return {
            id: item.id,
            name: item.name,
            case: item.case,
            from: item.from,
            to: item.to,
          };
        });
        store.dispatch(pushRelation(items));
      }
    }
  );

  //获取用户选择的主题
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    store.dispatch(refreshTheme("dark"));
  } else {
    store.dispatch(refreshTheme("ant"));
  }

  //设置时区到cookie
  function setCookie(c_name: string, value: string, expiredays: number) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      c_name +
      "=" +
      escape(value) +
      (expiredays == null
        ? ""
        : "; expires=" + exdate.toUTCString() + ";path=/");
  }
  const date = new Date();
  const timezone = date.getTimezoneOffset();
  setCookie("timezone", timezone.toString(), 10);
};

export default init;
