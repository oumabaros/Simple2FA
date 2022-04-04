using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Simple2FA
{
    public class DBF
    {
        public static DataTable GetCMS()
        {
            DataTable Dat = new DataTable();
            Dat.Clear();
            
            Dat.Columns.Add("UID");
            Dat.Columns.Add("UserRole");
            Dat.Columns.Add("Fname");
            Dat.Columns.Add("Lname");
            Dat.Columns.Add("CMS_CID");
            Dat.Columns.Add("SecureCode");
            Dat.Columns.Add("Active");
            Dat.Columns.Add("UserName");
            Dat.Columns.Add("Password");

            DataRow dr = Dat.NewRow();
           
            dr["UID"] = 11;
            dr["UserRole"] = "Admin";
            dr["Fname"] = "John";
            dr["Lname"] = "Brians";
            dr["CMS_CID"] = 7;
            dr["SecureCode"] = "6FA06927-57ED-4C9D-8568-2783AE6A7990";
            dr["Active"] = true;
            dr["UserName"] = "test@test.com";
            dr["Password"] = "pass@1234";
            Dat.Rows.Add(dr);

            return Dat;
        }

    }
}
