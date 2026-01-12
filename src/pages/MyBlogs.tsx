import CreateBlog from '../components/CreateBlog'

const MyBlogs = () => {
    return (
        <div className="flex flex-col gap-6 mt-8 mb-16">
            <h2 className="text-2xl font-semibold text-center">My Blogs</h2>

            <div className='w-full flex justify-center'>
                <div className="w-full max-w-2xl">
                    <CreateBlog />
                </div>
            </div>
        </div>
    )
}

export default MyBlogs