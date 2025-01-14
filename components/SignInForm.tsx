// app/components/SignInForm.tsx
import Link from "next/link";
import Image from "next/image";

interface SignInFormProps {
  signInWithEmail: ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => void;
  clerkError: string;
}

const SigninForm = ({signInWithEmail, clerkError}: SignInFormProps) => {
  return (
    <div className="mt-12 justify-items-center md:mt-20 mx-auto flex justify-center gap-24">
      <Image src="Ascalon vector no line.svg" alt="Ascalon Logo" width={512} height={512} className="opacity-60"/>
      <div className="pt-28">
        <div className="p-6 md:p-8 w-96">
          <h1 className="mb-6 text-3xl font-semibold text-[#e63d4e]">
            LOGIN
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                email: {value: string};
                password: {value: string};
              };
              const email = target.email.value;
              const password = target.password.value;
              signInWithEmail({emailAddress: email, password: password});
            }}
          >
            <input
              name="email"
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              placeholder="Email address"
              type="email"
              required
            />
            <input
              name="password"
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              placeholder="Password"
              type="password"
              required
            />
            <h2 className="text-slate-700 mb-8">
              {clerkError && <p>{clerkError}</p>}
            </h2>
            <button
              className="block w-full h-12 mb-6 text-sm font-light text-white bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 hover:text-white rounded-md"
              type="submit"
            >
              LOGIN
            </button>
          </form>
          <p className="text-sm font-light text-center text-black">
            Don&apos;t have an acccount?
            <Link className="ml-2 text-blue-600" href="/sign-up">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
