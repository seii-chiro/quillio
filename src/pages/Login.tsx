import InputLabelGroup from '../components/input-label-goup'
import StyledInput from '../components/styled-input'
import FormSubmitButton from '../components/styled-submit-btn'

const Login = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center from-sky-50 to-white">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 ring-1 ring-slate-100">
        <div className="w-full flex justify-center items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-2xl text-white font-bold">Q</div>
          <div className=''>
            <h1 className="text-lg font-bold text-slate-800">Quillio</h1>
            <p className="text-xs text-slate-400">Write and share.</p>
          </div>
        </div>

        <p className="text-sm text-center text-slate-500 mb-4">Sign in to continue to your account</p>

        <form action="" className="mt-2 flex flex-col gap-3">
          <InputLabelGroup>
            <label htmlFor="email" className='text-sm font-medium text-slate-700'>Email</label>
            <StyledInput type="email" id="email" name="email" placeholder="you@example.com" />
          </InputLabelGroup>

          <InputLabelGroup>
            <label htmlFor="password" className='text-sm font-medium text-slate-700'>Password</label>
            <StyledInput type="password" id="password" name="password" placeholder="Enter password" />
          </InputLabelGroup>

          <FormSubmitButton
            type="submit"

          >
            Log in
          </FormSubmitButton>

          <p className="text-center text-sm text-slate-500 mt-4">
            Don’t have an account? <a href="/register" className="text-sky-600 hover:underline">Create one</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login