import { useLocalSearchParams } from "expo-router";
import VerifyOtpPage from "@/components/Auth/VerifyOTP";

export default function VerifyOTP() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    return <VerifyOtpPage phone={phone} />;
}
