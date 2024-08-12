import prismadb from "@/lib/prismadb";
import { UserForm }  from "./_components/usersForm";


const UsersPage = async() => {
  const users = await prismadb.user.findMany();
  return ( 
    <div className="flex justify-center items-center w-full h-full bg-[#fffff5]">
      <div className="space-y-4 mt-11 mb-5">
        {users.map((user) => {
          return (
            <div key={user.name+user.updatedAt}>
              <UserForm data={user}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersPage;
