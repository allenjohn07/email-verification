import React, { useEffect, useRef, useState } from 'react';
import { InputOtp } from 'primereact/inputotp';
import Cookies from 'universal-cookie';
import { instance } from '../../config/axios';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import logo from '../assets/verification.png'
import { Button } from 'flowbite-react';


export default function EnterOtp() {
    const [token, setTokens] = useState();
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const cookies = new Cookies()
    const toast = useRef(null);
    const navigate = useNavigate()

    const customInput = ({ events, props }) => {
        return <><input {...events} {...props} type="text" className="custom-otp-input-sample" />
            {props.id === 2 && <div className="px-3">
                <i className="pi pi-minus" />
            </div>}
        </>
    };

    useEffect(() => {
        setEmail(cookies.get("email"))
    }, [email])

    //function to handle resend button
    const handleResend = async () => {
        try {
            if (!email) {
                toast.current.show({ severity: 'error', detail: 'Email is required', life: 3000 });
                setTimeout(() => {
                    navigate('/')
                }, 3000);
                return
            }
            setLoading(true)
            const response = await instance.post('/api/addEmail', { email })
            // console.log(response.data);
            toast.current.show({ severity: 'success', detail: `${response.data.message}`, life: 3000 });
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    //function to handle submit button
    const handleSubmit = async () => {
        try {
            // console.log(token);
            if (!token || token.length !== 6) {
                toast.current.show({ severity: 'error', detail: 'Invalid OTP', life: 3000 });
                return
            }
            if (!email) {
                toast.current.show({ severity: 'error', detail: 'Email is required', life: 3000 });
                setTimeout(() => {
                    navigate('/')
                }, 3000);
                return
            }
            setLoading(true)
            const response = await instance.post('/api/verifyOtp', {
                email,
                token: Number(token)
            })
            // console.log(response.data);
            if (response.data.message === 'Verified Successfully!') {
                toast.current.show({ severity: 'success', detail: `${response.data.message}`, life: 3000 });
                setTokens('')
                cookies.remove("email")
                setTimeout(() => {
                    navigate('/')
                    setLoading(false)
                }, 3000);
                return
            }
            setTokens('')
            toast.current.show({ severity: 'error', detail: `${response.data.message}`, life: 3000 });
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    //function to handle back
    const handleGoBack = () => {
        cookies.remove("email")
        navigate('/')
    }


    return (
        <div className="card flex items-center justify-center h-screen">
            <div className='absolute lg:top-10 lg:left-10 top-5 left-5 font-semibold font-mono flex items-center gap-1'>
                <img className='w-6' src={logo} alt="logo" />
                Email verification.
            </div>
            <Toast className='w-[300px] lg:w-[300px]' ref={toast} position="bottom-right" />
            <style scoped>
                {`
                    .custom-otp-input-sample {
                        width: 48px;
                        height: 48px;
                        font-size: 24px;
                        appearance: none;
                        text-align: center;
                        transition: all 0.2s;
                        border-radius: 0;
                        border: 1px solid var(--surface-400);
                        background: transparent;
                        outline-offset: -2px;
                        outline-color: transparent;
                        border-right: 0 none;
                        transition: outline-color 0.3s;
                        color: var(--text-color);
                    }

                    .custom-otp-input-sample:focus {
                        outline: 2px solid var(--primary-color);
                    }

                    .custom-otp-input-sample:first-child,
                    .custom-otp-input-sample:nth-child(5) {
                        border-top-left-radius: 12px;
                        border-bottom-left-radius: 12px;
                    }

                    .custom-otp-input-sample:nth-child(3),
                    .custom-otp-input-sample:last-child {
                        border-top-right-radius: 12px;
                        border-bottom-right-radius: 12px;
                        border-right-width: 1px;
                        border-right-style: solid;
                        border-color: var(--surface-400);
                    }
                `}
            </style>
            {
                loading ?
                    <div className="flex items-center space-x-2">
                        <Loader className="animate-spin" />
                        <span className='font-semibold text-gray-700'>Please wait...</span>
                    </div>
                    :
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-xl mb-2">Verify your Email</p>
                        <p className="text-color-secondary block mb-5">Please enter the code sent to your email.</p>
                        <InputOtp value={token} onChange={(e) => setTokens(e.value)} length={6} inputTemplate={customInput} style={{ gap: 0 }} />
                        <div className="flex justify-between mt-5 self-stretch">
                            <Button onClick={handleResend} gradientDuoTone="tealToLime">Resend Code</Button>
                            <Button onClick={handleSubmit} gradientDuoTone="tealToLime">Submit Code</Button>
                        </div>
                    </div>
            }
            <div className='absolute bottom-10 right-10'>
                <Button onClick={handleGoBack} gradientDuoTone="tealToLime">Go back</Button>
            </div>
        </div>
    );
}
