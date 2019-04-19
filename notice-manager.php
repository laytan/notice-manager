<?php
/**
 * Plugin Name: Notice Manager
 * Description: A lightweight plugin that lets you organize notices and notifications from other plugins or wordpress itself.
 * Version: 1.0.0
 * Author: Laytan Laats
 * Author URI: https://github.com/laytan
 * License: GNU GENERAL PUBLIC LICENSE
 * License URI: LICENSE.txt
 * Text Domain: notice-manager
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
    die;
}

// Our whole plugin is only used in admin mode, so we return if we are not
if ( ! is_admin() ) {
    return;
}

$base_url = plugin_dir_url( __FILE__ );
$version = '1.0.0';

// Create the plugin object
require_once plugin_dir_path( __FILE__ ) . '/includes/class-notice-manager.php';
$notice_manager_plugin = new Notice_Manager( $base_url, $version );

/**
 * Registers the onActivate function
 */
if ( ! function_exists( 'notice_manager_activate' ) ) {
    function notice_manager_activate()
    {
        Notice_Manager::on_activate();
    }
}
register_activation_hook( __FILE__, 'notice_manager_activate' );


if ( ! function_exists( 'notice_manager_uninstall' ) ) {
    function notice_manager_uninstall()
    {
        Notice_Manager::on_uninstall();
    }
}
register_uninstall_hook( __FILE__ , 'notice_manager_uninstall' );