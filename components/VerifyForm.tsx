// app/components/VerifyForm.tsx
import { FormEvent } from "react"

interface VerifyFormProps {
    handleVerify: (e: FormEvent) => void
    code: string
    setCode: (value: string) => void
}

const VerifyForm = ({handleVerify, code, setCode}: VerifyFormProps) => {
  return (
    <div className="flex justify-center mt-12 justify-items-center md:mt-20">
      <div className="h-auto PT-28 w-80 md:w-96">
        <div className="p-6 md:p-8">
          <h1 className="mb-6 text-3xl font-light text-[#e63d4e]">
            VERIFICATION CODE
          </h1>
          <form onSubmit={handleVerify}>
            <input
              value={code}
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              id="code"
              name="code"
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              className="w-full h-12 mb-6 text-sm font-light text-white hover:text-white bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 rounded-md"
              type="submit"
            >
              Complete sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyForm
