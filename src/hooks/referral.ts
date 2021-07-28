import Cookies from "js-cookie";
import { useRouter } from "next/router";

export function useSetReferralCookie() {
  const router = useRouter();
  const referer = router.query?.ref;

  if (referer) {
    Cookies.set("ref", referer);
  }
}

export function getReferralAddress() {
  return Cookies.get("ref") ? `0x${Cookies.get("ref")}` : null;
}
