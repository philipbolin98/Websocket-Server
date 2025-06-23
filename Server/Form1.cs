using System.Diagnostics;

namespace Server {
    public partial class Form1 : Form {
        public Form1() {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e) {
            try {

                Global.WebServer = new();

            } catch (Exception ex) {
                Debug.WriteLine(ex.Message);
            }
        }
    }
}