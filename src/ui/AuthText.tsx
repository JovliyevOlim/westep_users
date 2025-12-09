
function AuthText({title,body}: {title?: string; body?: string}) {
    return (
        <>
            <h1 className="text-4xl text-gray-900 font-semibold text-center mb-3">{title}</h1>
            <p className="text-lg text-gray-900  text-center mb-8">{body}</p>
        </>
    );
}

export default AuthText;