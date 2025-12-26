import {User} from "../../types/types.ts";
import {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import NewInput from "../../ui/NewInput.tsx";
import Button from "../../ui/Button.tsx";
import PhoneNumberInput from "../../ui/PhoneNumberInput.tsx";


interface Props {
    user: User;
    setEdit: (edit: boolean) => void;
}

function UpdateProfileUser({user}: Props) {


    const [initialValues, setInitialValues] = useState<Omit<User, "phone" | "password">>({
        firstname: "",
        lastname: "",
        gender: "",
        phoneNumber: '',
        birthDate: '',
    });


    useEffect(() => {
        if (user) {
            setInitialValues({
                firstname: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                birthDate: user.birthDate,
            })
        }
    }, [user]);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstname: Yup.string()
                .required("Ismni kiriting!"),
            lastname: Yup.string()
                .required("Familiyani kiriting!"),
        }),
        onSubmit: async () => {
            // await addModule({...formik.values,orderIndex:modulesLength+1});
            // formik.resetForm();
            // setOpen(false);
        },
    });

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                }}
                className={'mt-5 flex flex-col justify-between'}>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <NewInput type="text" label={'Ism'} formik={formik} name="firstname" placeholder="Ism"/>
                        <hr className={'border-gray-100 mt-3'}/>
                    </div>
                    <div>
                        <NewInput type="text" label={'Familiya'} formik={formik} name="lastname"
                                  placeholder="Familiya"/>
                        <hr className={'border-gray-100 mt-3'}/>
                    </div>
                    <div>
                        <PhoneNumberInput formik={formik} label={'Telefon raqam'} name="phoneNumber"
                                          className={'outline-hidden w-full text-md text-gray-900 font-semibold border-none p-0'}/>
                        <hr className={'border-gray-100 mt-3'}/>
                    </div>
                </div>

                <div className="mt-3 flex gap-6 justify-end">
                    <Button
                        className={'flex items-center justify-center gap-2 bg-blue-600 text-md text-white w-full p-[8px] rounded-full'}
                        type="submit"
                        variant="primary"
                        // size={'sm'}
                        // isPending={isAdding}
                        // disabled={isAdding}
                    >
                        Saqlash
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default UpdateProfileUser;