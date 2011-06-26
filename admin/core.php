<!--
/*
 *  Copyright 2010 Felix Schulze
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
-->
<?php

include("../db.php");
$global_dbh = mysql_connect($dbhost, $dbuser, $dbpass)
        or die("Could not connect to database");
mysql_select_db($dbname)
        or die("Could not select database");

function display_db_query($query_string, $connection, $names) {
    $result_id = mysql_query($query_string, $connection)
            or die("display_db_query:" . mysql_error());
    $column_count = mysql_num_fields($result_id)
            or die("display_db_query:" . mysql_error());

    print "<thead>\n";
    print("<tr>\n");

    for ($column_number = 0; $column_number < $column_count; $column_number++) {
        $field_name = $names[$column_number];
        print("<th>$field_name</th>\n");
    }
    print("</tr>\n");
    print "</thead>\n";

    print("<tbody>\n");

    while ($row = mysql_fetch_row($result_id)) {
        print("<tr class=\"gradeA\">");
        for ($column_number = 0; $column_number < $column_count; $column_number++) {
            print("<td>$row[$column_number]</td>\n");
        }
        print("</tr>\n");
    }

    print("</tbody>\n");


    print "<tfoot>\n";

    print("<tr>\n");
    for ($column_number = 0; $column_number < $column_count; $column_number++) {
        $field_name = $names[$column_number];
        print("<th>$field_name</th>\n");
    }
    print("</tr>\n");

    print "</tfoot>\n";
}

function display_db_table($tablename, $connection, $names) {
    $fields = array("APP_VERSION_NAME", "USER_CRASH_DATE", "ANDROID_VERSION", "PHONE_MODEL", "PACKAGE_NAME", "STACK_TRACE");

    $query_string = 'SELECT ' . implode(',', $fields) . ' FROM ' . $tablename;

    display_db_query($query_string, $connection, $names);
}

?>
