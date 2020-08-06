<?php
if ( ! class_exists( 'Notice_Manager' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'class-notice-manager-database.php';

    class Notice_Manager
    {
        public $database;

        public $plugin_name;

        public $base_url;

        public $version;

        public function __construct( $base_url, $version ) 
        {
            $this->base_url = $base_url;

            $this->version = $version;

            $this->database = new Notice_Manager_Database();

            $this->plugin_name = 'Notice Manager';

            $this->check_request();

            add_action( 'admin_menu', array( $this, 'load_admin_page' ) );

            add_action( 'init', array($this, 'load_text_domain' ) );

            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        }

        public function enqueue_scripts()
        {
            // Register so we can reference it with localize script
            wp_register_script( $this->plugin_name . ' js', $this->base_url . 'js/noticemanager.js' );
            // Get our bans out of the database to 'inject' to our script
            $bans = $this->database->get_bans();
            // Inject our bans
            wp_localize_script( $this->plugin_name . ' js', 'noticeManagerBans', $bans );
            // Make the js code translatable
            $translations = $this->get_js_translations();
            wp_localize_script( $this->plugin_name . ' js', 'i18n', $translations );
            // Actually enqueue it
            wp_enqueue_script( $this->plugin_name . ' js', $this->base_url . 'js/noticemanager.js', array( 'jquery' ), $this->version, false);

            // Enqueue our styling
            wp_enqueue_style( $this->plugin_name . ' css', $this->base_url . 'css/style.css', array(), $this->version );
        }

        /**
         * Run when the user activates the plugin
         */
        public static function on_activate()
        {
            Notice_Manager_Database::create_tables();
        }

        /**
         * Runs on uninstalling the plugin
         */
        public static function on_uninstall()
        {
            Notice_Manager_Database::uninstall();
        }

        public function check_request()
        {   
            if( isset( $_GET['notice-manager-ban-body'] ) && isset( $_GET['notice-manager-ban-nice-body'] ) ) {
                $body = sanitize_text_field( $_GET['notice-manager-ban-body'] );
                $nice_body = sanitize_text_field( $_GET['notice-manager-ban-nice-body'] );
                $this->database->insert_ban( $body , current_time( 'mysql' ), $nice_body );
                
                if ( isset( $_GET['notice-manager-redirect-url'] ) ) {
                    $redirect_url = esc_url_raw( $_GET['notice-manager-redirect-url'] );
                    $this->redirect( $redirect_url );
                } else {
                    $this->redirect( get_admin_url() );
                }
            }
        }

        /**
         * Safely redirects to a page on the site and shuts down our code after it
         */
        public function redirect( $url )
        {
            $url = esc_url($url);
            require_once( ABSPATH . 'wp-includes/pluggable.php' );
			wp_safe_redirect( $url );
			die;
        }
        /**
         * Unban a banned notice
         */
        public function unban( $id )
        {
            // If this is a valid request
            if (
                isset($_GET['action']) &&
                isset($_GET['nonce']) &&
                $_GET['action'] === 'notice-manager-unban' &&
                wp_verify_nonce($_GET['nonce'], 'notice-manager-unban' )
            ) {
                $this->database->unban( $id );
                $this->redirect( menu_page_url( 'notice-manager-page', false ) );
            }
        }

        public function load_admin_page()
        {
            add_submenu_page( 'tools.php', __('Notice Manager', 'notice-manager'), __('Notice Manager', 'notice-manager'), 'manage_options', 'notice-manager-page', array( $this, 'admin_page' ) );
        }
        
        public function admin_page()
        {
            include_once plugin_dir_path( __FILE__ ) . 'notice-manager-admin-page.php';
        }

        /**
         * Loads the translations
         */
        public function load_text_domain()
        {
            $path = dirname( plugin_basename( __FILE__ ) ) . '/languages';
            load_plugin_textdomain( 'notice-manager', false, $path );
        }

        /**
         * Returns an object to inject into our js with all the strings we need
         */
        public function get_js_translations()
        {
            return array(
                'manage_notice'     =>  __( 'Manage notice', 'notice-manager' ),
                'ban_this_notice'   =>  __( 'Ban this notice', 'notice-manager' ),
            );
        }
    }
}
