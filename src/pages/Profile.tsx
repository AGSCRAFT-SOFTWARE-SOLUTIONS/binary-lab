import { User } from "../types/types";

export default async ({ user }: { user: User }) =>
  user && (
    <section class="grid lg:grid-cols-[max-content_1fr] gap-12">
      <div class=" max-w-25rem">
        <img
          aria-label={user.name}
          src={`https://api.dicebear.com/7.x/big-smile/svg?seed=${user.name}`}
          class="w-full glow rd-full p-4"
          title={`hola! ${user.name}`}
        />
        <br />
        <br />
        <h2 class="break-all">{user.name}</h2>
        <p>Email : {user.email}</p>
        <p>Phone : {user.phone}</p>
        <p>Location : {user.location}</p>
        <p>Institute : {user.institute}</p>
        <br />
        <br />
        <div class="glow flex gap-4 p-3 rd-2xl w-[max-content] cursor-pointer">
          <i class="fa-solid fa-i-cursor"></i>
          Edit
        </div>
      </div>
      <div class="grid gap-8">
        <div>
          <h2>Your courses</h2>
          <br />
          <div class="course-grid"></div>
        </div>
        <div>
          <h2>Your certificates</h2>
          <br />
        </div>
      </div>
    </section>
  );
