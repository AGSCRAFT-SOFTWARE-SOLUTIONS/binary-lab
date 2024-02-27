export default ({ lang }: { lang: string }) => (
  <>
    <div
      data-pym-src="https://www.jdoodle.com/plugin"
      data-language={lang}
      class="rd-xl overflow-hidden"
    ></div>
    <script
      src="https://www.jdoodle.com/assets/jdoodle-pym.min.js"
      type="text/javascript"
    ></script>
    <link rel="stylesheet" href="/public/stylesheets/ide.css" />
  </>
);
