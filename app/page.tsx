import { Arrow } from "@/public/home/svgs/arrow";
// import { Terminal } from "@/public/home/svgs/terminal";

export default async function Home() {
  return (
    <main className="text-center mt-20">
      <div className="lg:w-[75%] min-lg:w-[80%] h-auto flex justify-end">
        <Arrow></Arrow>
      </div>
      <span className="text-[48px] font-extrabold">
        Code smarter. Solve harder.
        <span style={{ color: '#FF865B' }}>
          {" "} Hackacode
        </span>
      </span>
      { //<div className="flex flex-row justify-between">
        //<p className="text-[48px] font-extrabold">We know it’s tough, but with <span style={{color: '#FF865B'}}>Hackacode</span>, we’ve made it simple and fun!</p>
        //</div>
      }
      <img src={"https://hc-cdn.hel1.your-objectstorage.com/s/v3/bba1dfde0cb6b3fe66319c947773ebd0ccca7af9_terminal.png"} className="mx-auto mt-14"></img>
    </main>
  );
}
