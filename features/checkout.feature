Feature: Checkout flow

  Scenario: Complete an order (should pass)
    Given I open the login page
    When I login with "standard_user" and "secret_sauce"
    And I add the first product to the cart
    And I open the cart
    And I proceed to checkout and fill details with "John" "Doe" "12345"
    And I finish the order
    Then I should see the confirmation message "Thank you for your order!"

  Scenario: Checkout confirmation mismatch (demo failing)
    Given I open the login page
    When I login with "standard_user" and "secret_sauce"
    And I add the first product to the cart
    And I open the cart
    And I proceed to checkout and fill details with "John" "Doe" "12345"
    And I finish the order
    Then I should see the confirmation message "Incorrect expected message"  # intentionally incorrect to fail

