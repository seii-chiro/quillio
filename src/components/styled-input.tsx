const StyledInput = ({ ...props }) => {
  return (
    <input
      className="h-9 border border-gray-200 rounded-md px-2 focus:outline-none focus:ring-0 focus:border-black"
      {...props}
    />
  )
}

export default StyledInput