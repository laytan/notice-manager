<?php
if ( ! class_exists( 'Notice_Manager_Database' ) ) {

    class Notice_Manager_Database
    {
        public static $table_name = 'notice_manager_bans';
        public static $database_version = '1.0.0';

        public function __construct() 
        {
            //
        }

        /**
         * Create our needed tables
         */
        public static function create_tables()
        {
            global $wpdb;
        
            $table_name = $wpdb->prefix . Notice_Manager_Database::$table_name;
            
            $charset_collate = $wpdb->get_charset_collate();
        
            $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
                body text NOT NULL,
                nice_body text NOT NULL,
                PRIMARY KEY  (id)
            ) $charset_collate;";
        
            require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
            dbDelta( $sql );
        
            add_option( 'notice_manager_db_version', Notice_Manager_Database::$database_version );
        }

        /**
         * Drop the table and version option
         */
        public static function uninstall() 
        {
            delete_option( 'notice_manager_db_version' );
            global $wpdb;
            $table = $wpdb->prefix . Notice_Manager_Database::$table_name;
            $wpdb->query( "DROP TABLE IF EXISTS $table" );
        }

        /**
         * Stores a new ban row into the database
         */
        public function insert_ban( $body, $time, $nice_body )
        {
            global $wpdb;
		    $table = $wpdb->prefix . 'notice_manager_bans';

            $wpdb->insert(
                $table,
                array(
                    'time' => $time,
                    'body' => $body,
                    'nice_body' =>  $nice_body,
                )
            );
        }

        /**
         * Unbans a ban
         */
        public function unban( $id )
        {
            global $wpdb;
            $table = $wpdb->prefix . 'notice_manager_bans';

            $wpdb->delete( $table, array(
                'id'    =>  $id,
            ) );
        }

        /**
         * Returns all the bans
         */
        public function get_bans()
        {
            global $wpdb;
            $table = $wpdb->prefix . 'notice_manager_bans';
            return $wpdb->get_results("SELECT * FROM $table");
        }
    }
}
