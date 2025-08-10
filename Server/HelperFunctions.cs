using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server {
    internal class HelperFunctions {

        public static string IncrementName(string name, HashSet<string> hashset) {

            if (!hashset.Contains(name)) {
                return name;
            }

            string numberString = "";

            for (int i = name.Length - 1; i >= 0; i--) {

                string character = name[i].ToString();

                if (int.TryParse(character, out int digit)) {
                    numberString = digit.ToString() + numberString;
                } else {
                    break;
                }
            }

            string baseName = name.Substring(0, name.Length - numberString.Length);
            int number = numberString == "" ? 1 : int.Parse(numberString);

            do {
                number++;
                name = $"{baseName}{number}";
            } while (hashset.Contains(name));

            return name;
        }
    }
}