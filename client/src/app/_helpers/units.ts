import { Brawler } from "../_models/brawler";
import { PassportMatchValidator } from "./passwordvalidator/passwordvalidator";

const _default_avatar = '/assets/images/default_avatar.jng';

export function getDefaultAvatar(passport: Brawler): string {
  if(passport && passport.avatar_url ) return passport.avatar_url;
    return _default_avatar;
}