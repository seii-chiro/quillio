import CreateBlog from '../components/CreateBlog'

const MyBlogs = () => {
    return (
        <div className="px-4">
            <h2 className="text-2xl font-semibold mb-6">My Blogs</h2>

            <div className='w-full flex justify-center'>
                <div className="w-full max-w-2xl">
                    <CreateBlog />
                </div>
            </div>
        </div>
    )
}

export default MyBlogs