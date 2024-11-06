import PageWrapper from "src/components/PageWrapper";

const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
      This is a skeleton that can you can use to build a web app. It uses a
      React frontend, an express backend, and a MongoDB database. You can deploy
      it to Vercel for free. In your editor, search for <code>skeleton</code> to
      find all places where you should make your own changes. -- FOR LEADER

      PLEASE

      <tr>
        <th scope="col" class="pos" style="background: rgb(4, 83, 88);">#</th>
        <th scope="col" class="avatar" style="background: rgb(4, 83, 88);"></th>
        <th scope="col" class="id" style="background: rgb(63, 58, 54);">Steam ID</th>
        <th scope="col" class="country" style="background: rgb(22, 23, 39);">Country</th>
        <th scope="col" class="stat level relevant" data-type="XP" style="background: rgb(4, 83, 88);"> 
          "Level"
          ::after
        </th>
        <th scope="col" class="stat games" data-type="G" style="background: rgb(22, 23, 39);">Games</th>
        <th scope="col" class="stat badges" data-type="B" style="background: rgb(4, 83, 88);">Badges</th>
        <th scope="col" class="stat playtime" data-type="PT" style="background: rgb(7, 63, 54);">Playtime (H)</th>
        <th scope="col" class="stat age" data-type="A" style="background: rgb(63, 58, 54);">Years</th>
      </tr>
    </p>
  </PageWrapper>
);

export default Rank;
