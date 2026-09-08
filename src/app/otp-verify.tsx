import VerifyOtpPage from "@/components/Auth/VerifyOTP";
import { useLocalSearchParams } from "expo-router";

export default function VerifyOTP() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    return <VerifyOtpPage phone={phone} />;
}
