import Link from "next/link";
import Image from "next/image";

interface SignUpFormProps {
  signUpWithEmail: ({
    emailAddress,
    password,
    firstName,
    lastName,
  }: {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => void;
  clerkError: string;
}

const SignupForm = ({ signUpWithEmail, clerkError }: SignUpFormProps) => {
  return (
    <div className="mt-12 justify-items-center md:mt-20 mx-auto flex justify-center gap-24">
      <Image src="Ascalon vector no line.svg" alt="Ascalon Logo" width={512} height={512} className="opacity-60"/>
      <div className="pt-28">
        <div className="p-6 md:p-8 w-96">
          <h1 className="mb-6 text-3xl font-semibold text-[#e63d4e]">SIGN-UP</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                email: { value: string };
                password: { value: string };
                firstName: { value: string };
                lastName: { value: string };
              };
              const email = target.email.value;
              const password = target.password.value;
              const firstName = target.firstName.value;
              const lastName = target.lastName.value;
              signUpWithEmail({
                emailAddress: email,
                password,
                firstName,
                lastName,
              });
            }}
          >
            <input
              name="firstName"
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              placeholder="First Name"
              type="text"
              required
            />
            <input
              name="lastName"
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              placeholder="Last Name"
              type="text"
              required
            />
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
            <h2 className="text-red mb-8">
              {clerkError && <p>{clerkError}</p>}
            </h2>
            <button
              className="w-full h-12 mb-6 text-sm font-light text-white bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 hover:text-white rounded-md"
              type="submit"
            >
              Create an account
            </button>
          </form>
          <p className="text-sm font-light text-center text-black">
            Already have an acccount?
            <Link className="ml-2 text-blue-600" href="/sign-in">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;