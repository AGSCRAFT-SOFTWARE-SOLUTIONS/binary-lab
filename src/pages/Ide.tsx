export const Ide = ({ lang }: { lang: string }) => (
  <>
    <div
      data-pym-src="https://www.jdoodle.com/plugin"
      data-language={lang}
      class="rd-36 overflow-hidden"
    ></div>
    <script
      src="https://www.jdoodle.com/assets/jdoodle-pym.min.js"
      type="text/javascript"
    ></script>
  </>
);
