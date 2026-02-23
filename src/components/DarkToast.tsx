import { toast } from "react-toastify";

export const darkToast = {
        info : (message: string) => {
            toast.info(message, {
                autoClose: 3000,
                position: 'bottom-right',
                theme: 'dark',
            });
        },
        success : (message: string) => {
            toast.success(message, {
                autoClose: 3000,
                position: 'bottom-right',
                theme: 'dark',
            });
        },
        error : (message: string) => {
            toast.error(message, {
                autoClose: 3000,
                position: 'bottom-right',
                theme: 'dark',
            });
        },
}