Feature: Saucedemo login

  Scenario Outline: As a user, I can log into the inventory

    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying <message>

    Examples:
      | username                  | password       | message  |
      | standard_user             | secret_sauce   | Products |
      | locked_out_user           | secret_sauce   | Epic sadface: Sorry, this user has been locked out. |
      | problem_user              | secret_sauce   | Products |
      | performance_glitch_user   | secret_sauce   | Products |
      | error_user                | secret_sauce   | Products |
      | visual_user               | secret_sauce   | Products |

